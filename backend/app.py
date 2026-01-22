from flask import Flask, jsonify, send_from_directory, request
from tools.graph_tools import bfs_find_paths, generate_mechanism_summary, score_repurposing_opportunity
from flask_cors import CORS
import os
import json
import anthropic

# CML project directory
if os.path.exists('/home/cdsw'):
    PROJECT_DIR = '/home/cdsw'
else:
    PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__, 
            static_folder=os.path.join(PROJECT_DIR, 'frontend/dist'),
            static_url_path='')

CORS(app)

# Load seed graph
SEED_GRAPH_PATH = os.path.join(PROJECT_DIR, 'data/seed_graph.json')
with open(SEED_GRAPH_PATH, 'r') as f:
    SEED_GRAPH = json.load(f)

print(f"✓ Loaded seed graph: {len(SEED_GRAPH['entities'])} entities, {len(SEED_GRAPH['relationships'])} relationships")

# Initialize Claude client
claude_client = None
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')

if ANTHROPIC_API_KEY:
    claude_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    print("✓ Claude API client initialized")
else:
    print("⚠️  Warning: ANTHROPIC_API_KEY not set")

def extract_triplets_with_claude(text: str) -> list:
    """Extract knowledge triplets from text using Claude"""
    
    if not claude_client:
        raise Exception("Claude API client not initialized. Set ANTHROPIC_API_KEY environment variable.")
    
    # Load prompt template
    prompt_path = os.path.join(PROJECT_DIR, 'prompts/extract_triplets.txt')
    with open(prompt_path, 'r') as f:
        prompt_template = f.read()
    
    # Fill in the publication text
    prompt = prompt_template.replace('{PUBLICATION_TEXT}', text)
    
    print(f"🤖 Calling Claude API to extract triplets...")
    
    # Call Claude
    response = claude_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        messages=[{
            "role": "user",
            "content": prompt
        }]
    )
    
    # Extract JSON from response
    response_text = response.content[0].text
    
    # Remove markdown code fences if present
    response_text = response_text.replace('```json', '').replace('```', '').strip()
    
    # Parse JSON
    triplets = json.loads(response_text)
    
    print(f"✓ Extracted {len(triplets)} triplets")
    
    return triplets

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello Rameez!'})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'graph_entities': len(SEED_GRAPH['entities']),
        'graph_relationships': len(SEED_GRAPH['relationships'])
    })

@app.route('/api/graph-data', methods=['GET'])
def get_graph_data():
    """Return graph data in format for react-force-graph"""
    
    # Transform to nodes/links format
    nodes = [
        {
            'id': entity['id'],
            'name': entity['name'],
            'type': entity['type'],
            'group': entity['type']  # For coloring
        }
        for entity in SEED_GRAPH['entities']
    ]
    
    links = [
        {
            'source': rel['source'],
            'target': rel['target'],
            'label': rel['relation'],
            'confidence': rel.get('confidence', 0.5)
        }
        for rel in SEED_GRAPH['relationships']
    ]
    
    return jsonify({
        'nodes': nodes,
        'links': links
    })

@app.route('/api/upload-publication', methods=['POST'])
def upload_publication():
    """
    Receive uploaded publication and extract triplets using Claude
    """
    try:
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Read file content
        content = file.read().decode('utf-8')
        
        print(f"✓ Received publication: {file.filename} ({len(content)} characters)")
        
        # Extract triplets with Claude
        triplets = extract_triplets_with_claude(content)
        
        return jsonify({
            'success': True,
            'filename': file.filename,
            'content': content,
            'triplets': triplets,
            'triplet_count': len(triplets)
        })
    
    except Exception as e:
        print(f"❌ Upload error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/discover', methods=['POST'])
def discover():
    """
    Discover drug repurposing opportunities
    """
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({
                'success': False,
                'error': 'No question provided'
            }), 400
        
        print(f"🔍 Discovery question: {question}")
        
        # Simple parsing: look for drug and disease names in question
        # For demo, we'll use Semaglutide → Obesity
        # In production, would use NLP to extract entities
        
        drug_name = "Semaglutide"
        disease_name = "Obesity"
        
        # TODO: Smarter entity extraction from question
        # For now, hardcode the demo case
        
        print(f"🎯 Searching: {drug_name} → {disease_name}")
        
        # Find paths
        paths = bfs_find_paths(
            SEED_GRAPH,
            start_entity=drug_name,
            target_entity=disease_name,
            max_depth=10
        )
        
        if not paths:
            return jsonify({
                'success': True,
                'found_paths': False,
                'message': f'No paths found between {drug_name} and {disease_name}'
            })
        
        # Get top path
        top_path = paths[0]
        
        # Get drug entity details
        drug_entity = next(
            (e for e in SEED_GRAPH['entities'] if e['name'] == drug_name),
            {}
        )
        
        # Score the opportunity
        scores = score_repurposing_opportunity(top_path, drug_entity)
        
        # Generate mechanism summary
        mechanism = generate_mechanism_summary(top_path)
        
        # Build discovery result
        # Build discovery result
        discovery = {
            'success': True,
            'found_paths': True,
            'drug': drug_name,
            'disease': disease_name,
            'top_path': {
                'nodes': [n['name'] for n in top_path['node_details']],
                'node_ids': top_path['nodes'],
                'edges': top_path['edges'],
                'edge_details': top_path['edge_details'],  # ← Add this line
                'mechanism': mechanism,
                'confidence': top_path['confidence'],
                'path_length': top_path['length'],
                'hidden_connections': top_path.get('hidden_connections', 0)  # ← Add this line
            },
            'scores': scores,
            'alternative_paths': len(paths),
            'hypothesis': f"{drug_name} may be effective for {disease_name} treatment",
            'mechanism_summary': f"Through {top_path['length']}-step pathway involving " +
                            " → ".join([n['name'] for n in top_path['node_details'][1:-1]]),
            'key_insight': f"Discovery bridges {top_path.get('hidden_connections', 0)} hidden cross-domain connections from neuroscience literature"  # ← Add this line
        }
        
        print(f"✓ Discovery complete: {len(paths)} paths found")
        print(f"  Top path: {top_path['length']} hops, {top_path['confidence']:.0%} confidence")
        print(f"  Mechanism: {mechanism}")
        
        return jsonify(discovery)
    
    except Exception as e:
        print(f"❌ Discovery error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    static_dir = os.path.join(PROJECT_DIR, 'frontend/dist')
    if path and os.path.exists(os.path.join(static_dir, path)):
        return send_from_directory(static_dir, path)
    return send_from_directory(static_dir, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('CDSW_APP_PORT', 8080))
    app.run(host='127.0.0.1', port=port, debug=True)
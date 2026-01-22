"""
Single discovery agent using Claude API
"""
import json
import os
from anthropic import Anthropic

# Initialize Claude client
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY environment variable not set")

claude_client = Anthropic(api_key=ANTHROPIC_API_KEY)

def run_discovery_agent(question: str, path_data: dict) -> dict:
    """
    Run the discovery agent to analyze a repurposing opportunity
    """
    
    # Load prompt template
    project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    prompt_path = os.path.join(project_dir, 'prompts/discovery_agent.txt')
    
    with open(prompt_path, 'r') as f:
        prompt_template = f.read()
    
    # Format prompt with data
    prompt = prompt_template.replace('{QUESTION}', question)
    prompt = prompt.replace('{PATH_DATA}', json.dumps(path_data, indent=2))
    
    print(f"🤖 Discovery Agent analyzing pathway...")
    
    # Call Claude
    response = claude_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": prompt
        }]
    )
    
    # Extract JSON from response
    response_text = response.content[0].text
    
    # DEBUG: Print raw response
    print("=" * 80)
    print("RAW AGENT RESPONSE:")
    print(response_text)
    print("=" * 80)
    
    # Remove markdown code fences if present
    response_text = response_text.replace('```json', '').replace('```', '').strip()
    
    # Parse JSON
    try:
        insights = json.loads(response_text)
        
        # DEBUG: Print parsed keys
        print(f"✓ Parsed JSON keys: {list(insights.keys())}")
        print(f"✓ Has safety_rationale: {'safety_rationale' in insights}")
        if 'safety_rationale' in insights:
            print(f"✓ Safety rationale value: {insights['safety_rationale'][:100]}...")
        
        print(f"✓ Discovery Agent complete")
        return insights
        
    except json.JSONDecodeError as e:
        print(f"❌ Failed to parse agent response: {e}")
        print(f"Response: {response_text}")
        raise
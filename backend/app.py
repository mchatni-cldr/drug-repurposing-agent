from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os

# CML project directory
PROJECT_DIR = '/Users/mchatni/Projects/drug-repurposing-agent'

app = Flask(__name__, 
            static_folder=os.path.join(PROJECT_DIR, 'frontend/dist'),
            static_url_path='')

CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello Rameez!'})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

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
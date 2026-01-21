"""
Cloudera ML Application Entry Point
Serves pre-built frontend from git
"""
import os
import sys

# CML project directory
PROJECT_DIR = '/home/cdsw' if os.path.exists('/home/cdsw') else os.path.dirname(os.path.dirname(__file__))

# Add backend to path
sys.path.insert(0, os.path.join(PROJECT_DIR, 'backend'))

def main():
    # Check if frontend dist exists
    dist_path = os.path.join(PROJECT_DIR, 'frontend/dist/index.html')
    
    if not os.path.exists(dist_path):
        print("❌ ERROR: Frontend not built!")
        print(f"Looking for: {dist_path}")
        print("\nDirectory contents:")
        print(os.listdir(PROJECT_DIR))
        if os.path.exists(os.path.join(PROJECT_DIR, 'frontend')):
            print("\nFrontend directory contents:")
            print(os.listdir(os.path.join(PROJECT_DIR, 'frontend')))
        sys.exit(1)
    
    print("✅ Using pre-built frontend from git")
    
    # Import and run Flask app
    from backend.app import app
    
    # Get port from CML environment
    port = int(os.environ.get('CDSW_APP_PORT', 8080))
    
    print("\n" + "=" * 60)
    print(f"🚀 Starting Test App on port {port}")
    print(f"📡 API available at: /api/hello")
    print(f"🌐 Frontend available at: /")
    print("=" * 60 + "\n")
    
    # Start Flask
    app.run(
        host='127.0.0.1',
        port=os.getenv('CDSW_APP_PORT'),
        debug=False,
        threaded=True
    )

if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
Deployment script for Huiron Studios Website
This script helps to set up and run the Node.js server for the website.
"""

import os
import sys
import subprocess
import webbrowser
import time
from pathlib import Path

def check_node_installed():
    """Check if Node.js and npm are installed"""
    try:
        # Check node - use shell=True on Windows to find commands in PATH
        result_node = subprocess.run("node --version", shell=True, capture_output=True, text=True, check=True)
        print(f"✓ Node.js is installed: {result_node.stdout.strip()}")
        
        # Check npm
        result_npm = subprocess.run("npm --version", shell=True, capture_output=True, text=True, check=True)
        print(f"✓ npm is installed: {result_npm.stdout.strip()}")
        
        return True
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"✗ Node.js and npm are required but not found. Error: {e}")
        print("Please install Node.js from https://nodejs.org/")
        return False

def install_dependencies():
    """Install npm dependencies if needed"""
    if not Path("package.json").exists():
        print("✗ package.json not found. Cannot install dependencies.")
        return False
    
    print("Installing npm dependencies...")
    try:
        subprocess.run("npm install", shell=True, check=True)
        print("✓ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("✗ Failed to install dependencies")
        return False

def start_server():
    """Start the Express.js server"""
    print("Starting server on http://localhost:25587...")
    try:
        # Start the server in the background - use shell=True on Windows
        process = subprocess.Popen("node index.js", shell=True,
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE)
        
        # Give the server a moment to start
        time.sleep(2)
        
        # Check if process is still running
        if process.poll() is None:
            print("✓ Server is running")
            return process
        else:
            stderr = process.stderr.read().decode() if process.stderr else "Unknown error"
            print(f"✗ Server failed to start: {stderr}")
            return None
    except Exception as e:
        print(f"✗ Error starting server: {e}")
        return None

def open_browser():
    """Open the browser to the local site"""
    url = "http://localhost:25587"
    print(f"Opening browser to {url}...")
    try:
        webbrowser.open(url)
        print("✓ Browser opened successfully")
    except Exception as e:
        print(f"✗ Failed to open browser: {e}")

def main():
    """Main deployment function"""
    print("🚀 Deploying Huiron Studios Website...")
    print("=" * 50)
    
    # Check if Node.js is installed
    if not check_node_installed():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Start server
    server_process = start_server()
    if not server_process:
        sys.exit(1)
    
    # Open browser
    open_browser()
    
    print("=" * 50)
    print("✅ Deployment complete!")
    print("The site is now running at http://localhost:25587")
    print("Press Ctrl+C to stop the server")
    
    try:
        # Keep the script running until interrupted
        server_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping server...")
        server_process.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)  # Creates the SocketIO instance and links it to the Flask app

from app import routes  # Import routes to avoid circular imports

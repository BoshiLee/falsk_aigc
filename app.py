from flask import Flask, render_template
from flask_socketio import SocketIO
import configparser

from controllers.conversations import conversation
from controllers.socket_message_handler import handle_message

config = configparser.ConfigParser()
config.read('config.ini')


app = Flask(__name__)
app.config['SECRET_KEY'] = config['flask']['secret_key']
socketio = SocketIO(app)

user_sessions = {}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/conversation', methods=['GET', 'POST'])
def handle_conversation():
    return conversation(user_sessions)


@socketio.on('message')
def on_message(msg):
    handle_message(msg, user_sessions)


if __name__ == '__main__':
    socketio.run(app, debug=True)

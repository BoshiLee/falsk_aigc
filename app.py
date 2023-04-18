import datetime

import openai
from flask import Flask, render_template, request, json
from flask_socketio import SocketIO, send, emit
import configparser

config = configparser.ConfigParser()
config.read('config.ini')
openai.api_key = config['openai']['api_key']

app = Flask(__name__)
app.config['SECRET_KEY'] = config['flask']['secret_key']
socketio = SocketIO(app)


def ask_openai(messages, mak_tokens=300):
    response = openai.ChatCompletion.create(model='gpt-3.5-turbo',
                                            messages=messages,
                                            max_tokens=mak_tokens,
                                            temperature=0.5,
                                            stream=True,
                                            )
    response_str = response.choices[0].message.content.strip()
    return str(response_str)


def ask_openai_realtime(messages, max_tokens=300, temperature=0.5):
    response = openai.ChatCompletion.create(model='gpt-3.5-turbo',
                                            messages=messages,
                                            max_tokens=max_tokens,
                                            temperature=temperature,
                                            stream=True,
                                            )
    for chunk in response:
        if "choices" in chunk:
            choice = chunk.choices[0]
            if choice.finish_reason == "stop":
                return
            elif "content" in choice.delta:
                piece = choice.delta.content
                yield piece


@app.route('/')
def index():
    return render_template('index.html')


user_sessions = {}


@socketio.on('message')
def handle_message(msg):
    msg = str(msg.encode("utf-8").decode("utf-8"))
    send_message(role='user',
                 message='User: ' + msg,
                 timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                 )

    sid = request.sid
    if sid not in user_sessions:
        user_sessions[sid] = [{'role': 'system', 'content': 'You are a helpful assistant.'}]

    user_sessions[sid].append({'role': 'user', 'content': msg})

    ai_response = ask_openai_realtime(user_sessions[sid], max_tokens=300, temperature=0.5)
    stream_message = ''
    timestamp_ai = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    for line in ai_response:
        stream_message += line
        send_message(role='assistant',
                     message='AI: ' + stream_message,
                     timestamp=timestamp_ai
                     )
    user_sessions[sid].append({'role': 'assistant', 'content': stream_message})


def send_message(role, message, timestamp):
    wrapped_message = json.dumps({'timestamp': timestamp, 'message': message, 'role': role})
    emit('message', wrapped_message)


if __name__ == '__main__':
    socketio.run(app, debug=True)

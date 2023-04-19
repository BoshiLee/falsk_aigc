import datetime
from flask import request, json
from flask_socketio import emit
from .ask_ai import ask_openai_realtime


def handle_message(msg, user_sessions):
    msg = str(msg.encode("utf-8").decode("utf-8"))
    send_message(role='user',
                 message=msg,
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
                     message=stream_message,
                     timestamp=timestamp_ai
                     )
    user_sessions[sid].append({'role': 'assistant', 'content': stream_message})


def send_message(role, message, timestamp):
    wrapped_message = json.dumps({'timestamp': timestamp, 'message': message, 'role': role})
    emit('message', wrapped_message)
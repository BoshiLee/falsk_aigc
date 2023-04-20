import datetime
from flask import request, json
from flask_socketio import emit
from .ask_ai import ask_openai_realtime


def handle_message(msg, user_sessions):
    msg = str(msg.encode("utf-8").decode("utf-8"))
    sid = request.sid
    save_message(
        sid=sid,
        user_sessions=user_sessions,
        role='system',
        content='You are a helpful assistant.',
        timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    send_message(
        sid=sid,
        user_sessions=user_sessions,
        role='user',
        content=msg,
        timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    formatted_sessions = [
        {
            'role': session['role'],
            'content': session['content']
        } for session in user_sessions[sid]
    ]
    ai_response = ask_openai_realtime(formatted_sessions, max_tokens=300, temperature=0.5)
    stream_message = ''
    timestamp_ai = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    for line in ai_response:
        stream_message += line
        send_message(
            sid=sid,
            user_sessions=user_sessions,
            role='assistant',
            content=stream_message,
            timestamp=timestamp_ai,
            save=False
        )
    save_message(
        sid=sid,
        user_sessions=user_sessions,
        role='assistant',
        content=stream_message,
        timestamp=timestamp_ai,
    )



def save_message(sid: str, user_sessions: dict, role: str, content: str, timestamp: str):
    if sid not in user_sessions:
        user_sessions[sid] = [{'role': role, 'content': content, 'timestamp': timestamp}]
    else:
        user_sessions[sid].append({'role': role, 'content': content, 'timestamp': timestamp})


def send_message(sid: str, user_sessions: dict, role: str, content: str, timestamp: str, save: bool = True):
    wrapped_message = json.dumps({'role': role, 'content': content, 'timestamp': timestamp})
    emit('message', wrapped_message)
    if save:
        save_message(
            sid=sid,
            user_sessions=user_sessions,
            role=role,
            content=content,
            timestamp=timestamp
        )

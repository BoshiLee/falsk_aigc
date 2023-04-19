# conversations.py

from flask import request


def conversation(user_sessions):
    sid = request.sid

    if request.method == 'POST':
        data = request.get_json()
        if data and 'messages' in data:
            user_sessions[sid] = data['messages']
            return {'success': True}
        return {'success': False}, 400

    if request.method == 'GET':
        return {'messages': user_sessions.get(sid, [])}

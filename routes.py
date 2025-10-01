from app import app
from flask import request, jsonify
import requests

@app.route('/execute_code', methods=['POST'])
def execute_code():
    data = request.get_json()
    code = data['code']
    language_id = data['language_id']

    JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true"
    headers = {
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "X-RapidAPI-Key": "b8b59fd4c2msh5669fe7514677cdp151760jsn7d95150bc928",
        "Content-Type": "application/json"
    }
    payload = {
        "source_code": code,
        "language_id": language_id,
        "stdin": ""
    }

    response = requests.post(JUDGE0_URL, json=payload, headers=headers)
    return jsonify(response.json())

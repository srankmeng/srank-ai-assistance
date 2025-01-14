import requests
from flask import Flask, request, jsonify
from os import environ

OLLAMA_API_URL = environ.get("OLLAMA_API_URL")

app = Flask(__name__)

@app.route('/chatbot', methods=['POST'])
def chatbot():
  req_data = request.get_json()
  url = f"{OLLAMA_API_URL}/api/chat"
  
  payload = {
    "model": "llama3.2",
    "messages": [
      {
        "role": "user",
        "content": req_data["message"]
      }
    ],
    "stream": False
  }

  res = requests.post(
    url,
    json=payload
  )

  if res.status_code == 200:
    return jsonify(res.json()), 200
  else:
    return jsonify({"error": "Failed to get response from Ollama"}), 500

if __name__ == '__main__':
  app.run(debug=True, port=5000)
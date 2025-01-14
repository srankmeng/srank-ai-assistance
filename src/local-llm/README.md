# Chatbot (Flask)

## Prerequisites softwares

- ollama
- python3

## Run LLM

Pull LLM model

```sh
ollema pull llama3.2
```

## Run application

Activate venv

```sh
cd src/local-llm
python3 -m venv .venv
source .venv/bin/activate
```

Install requirements

```sh
pip3 install -r requirements.txt
```

>If need to generate requirements.txt
>
>```sh
>pip3 freeze > requirements.txt
>```

Modified .env.example to .env, then run application

```sh
python3 app.py
```

Run curl

```sh
curl --location 'http://localhost:5000/chatbot' \
--header 'Content-Type: application/json' \
--data '{
    "message": "ประเทศไทยมีกี่จังหวัด"
}'
```

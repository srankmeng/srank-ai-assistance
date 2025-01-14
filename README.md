# srank-assistance

The chat bot assistance for srank

## Chat API

The API implement with python flask and ollama.

Setup steps can be found at [README](src/loclal-llm/README.md)

Run curl

```sh
curl --location 'http://localhost:5000/chatbot' \
--header 'Content-Type: application/json' \
--data '{
    "message": "ประเทศไทยมีกี่จังหวัด"
}'
```

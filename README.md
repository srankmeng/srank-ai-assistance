# srank-ai-assistance

The AI assistance for srank

- Any question can be chat with this bot
- Upload the receipts for ***auto*** monthly expenses record to google sheet

## Line chat bot

Implement with firebase google cloud function

Setup steps can be found at [README](src/firebase-cloud-function/README.md)

### Flow diagram

```mermaid
graph TD;
    A[User Input in LINE Chat] -->|Send Message| B[LINE Webhook];
    B -->|Call Firebase Cloud Function| C[Firebase Cloud Function];
    C -->|Call Gemini API| D[Gemini API];
    D -->|Receive Response| C;
    C -->|Reply Message to User| B;
    C -->|Record Data to Google Sheet| E[Google Sheet];
```

### Usecases

#### Simple chat with text

Type plain text that include "***bot***" sent to chat, e.g. "bot ประเทศไทยมีกี่จังหวัด"

> ![line chat 01](assets/images/line_chat01.png)

#### Describe photo in chat

Uplaod the image in chat, then qouted the image and type "***bot***" sent to chat

> ![line chat 02](assets/images/line_chat02.png)

#### Upload receipt

Uplaod the receipt in chat, then qouted the image and type "***up***" sent to chat

> ![line upload receipt 01](assets/images/line_upload_receipt01.png)

Then, Append the data to google sheet automatically.
> ![line upload receipt 02](assets/images/line_upload_receipt02.png)

So, display daily expenses in chart on sheet.
> ![line upload receipt 03](assets/images/line_upload_receipt03.png)

## Local LLM Chat API

The API implement with python flask and ollama.

Setup steps can be found at [README](src/local-llm/README.md)

Run curl

```sh
curl --location 'http://localhost:5000/chatbot' \
--header 'Content-Type: application/json' \
--data '{
    "message": "ประเทศไทยมีกี่จังหวัด"
}'
```

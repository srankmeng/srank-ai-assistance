# Firebase cloud function

## Prerequisites softwares

- nodejs
- [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli)

## Installation for initial project in Firebase

### Install Firebase CLI

Open your terminal and run the following command:

```sh
npm install -g firebase-tools
```

### Initialize Firebase in Your Project

Navigate to your project directory and run:

```sh
firebase init
```

## Run & deploy

### Install Dependencies

```sh
cd functions
npm install
```

### Testing Locally

```sh
firebase emulators:start --only functions
```

Should be run on <http://127.0.0.1:5001/srank-assistance-d1bde/us-central1/lineWebHook>

>Publish localhost (optional)
>
>```sh
>ngrok http 5001
>```
>
>then copy the url and update the webhook in Line Developer Console

### Deploy

```sh
firebase deploy --only functions
```

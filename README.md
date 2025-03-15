# firebase-cloud-functions

this repo is for firebase cloud functions testing

## Emulators cloud function setup:

> [!NOTE]
> for testing functions locally

```
npm init

npm i firebase-tools -D

//LOGIN IF NOT

npm i firebase-tools login

//You can choose which email

npm i firebase-tools login:use email@email.com

npx firebase init functions

cd functions

npm run build:watch


//Another console
npm run serve

```

## users endpoint

It can create a user on the authentication part and automatically create a document in firestore in the users collection

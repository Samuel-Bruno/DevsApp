# DevsApp

A simple chat application using ReactJS, inpired by WhatsApp Web.

Project language: Brazilian Portuguese (PT-BR)


:construction: Project in development :construction:

## Functionalities
- Sign-up and log-in with e-mail
- Send and receive text messages and photos
- Use and update profile images
- Filter chats by name

## Used Tecnologies
- <img src="https://user-images.githubusercontent.com/68335377/188770131-80056eaa-41f8-4966-9dca-bd8572926dd9.svg" alt="ReactJS" width="20"/> ReactJs
- <img src="https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae" alt="Typescript" width="20" /> Typescript
- <img src="https://d33wubrfki0l68.cloudfront.net/0834d0215db51e91525a25acf97433051f280f2f/c30f5/img/redux.svg" alt="" width="20" /> Redux
- <img src="https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png" alt="" width="20" /> Firebase
- <img src="https://styled-components.com/favicon.png" alt="Styled-Components" width="20" /> Styled-components
- <img src="https://reactrouter.com/favicon-light.png" alt="React Router Dom" width="20" /> React Router Dom

## How to use
- See a model using this [link](https://google.com.br)
- Run on your machine
    1. Clone this repo
        > `git clone https://github.com/Samuel-Bruno/DevsApp`
    2. Install the necessary libs
        > `npm install`
    3. Run the project in development mode
        > `npm start`

## How it works
Using react-router-dom, the sistem verify if there's an user logged or a token stored in local. The user then is redirected to '/' if is logged, or to '/login' if not.

### The login page ('/login')
<p style="text-align:center;"><img src="https://user-images.githubusercontent.com/68335377/189194742-0e7e5103-277d-43aa-9a9e-9b37554d0ae4.jpeg" width="auto" height="200" /></p>
The user is allowed to log-in system using email/password only

### The signup page ('/signup')
<p style="text-align:center;"><img src="https://user-images.githubusercontent.com/68335377/189194768-290e9f5b-af10-4e2b-89df-b481051fc802.jpeg" width="auto" height="200" /></p>
The user is allowed to create an account using an username, email and password. The default user photo is added in registration.

### The main page ('/')
<p style="text-align:center;"><img src="https://user-images.githubusercontent.com/68335377/189194921-66a3bfe3-d21a-4adb-bff6-faeb65b18b85.jpeg" width="auto" height="200" /></p>
When the user gets in there, a request to firebase is made, given the userId, and receiving the chats where the user is in, with their respective messages, and the other user photo and name. So, they are stored using redux, and then showed to user.

<p style="text-align:center;"><img src="https://user-images.githubusercontent.com/68335377/189194932-f8262912-7c02-43ad-a0f2-f9b59b48b8b0.jpeg" width="auto" height="200" /></p>

> Adding user alert errors if the chat already exists, or the other user was not found.

### The config page
This page is divided in two areas. The personal and security area, that allows the user to change his userName, profile photo, and password.
<p style="text-align:center;"><img src="https://user-images.githubusercontent.com/68335377/189194954-e542641b-38c1-4eb9-bd21-4a291079b506.jpeg" width="auto" height="200" /></p>
<p style="text-align:center;"><img src="https://user-images.githubusercontent.com/68335377/189194959-002d07f4-a6d4-40de-b253-08f24d1624b1.jpeg" width="auto" height="200" /></p>

> When the user change his profile photo, userName, send a message or do other things that he can, the change is first made in local, and then in Firebase.

## Observations

The project is not concluded. It have yet to do:

- fix bugs when quiting chat. The chats list is not updating correctly and the messages area is still showing
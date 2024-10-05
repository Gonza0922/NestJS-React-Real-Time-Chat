# Real Time Chat

This project is a real-time chat created to demonstrate my fullstack skills and communication with websockets.

## Technologies

- Backend

  - NestJS: node.js framework
  - Socket.io: real time comunication
  - MySQL: database

- Frontend
  - React: javascript framework

## Main features

- Real Time Messaging: Users can send and receive messages instantly thanks to Socket.io integration.
- User Management: User registration and authentication for a personalized and secure chat.
- Profile Images: Creation and update of image for the user profile.
- Chat Rooms: Ability to create different chat rooms, facilitating organized conversations.

## Environment Variables

### Backend

- Open BackEnd folder

  ```
  cd BackEnd
  ```

- Copy the ".env.template" file to ".env"

  ```
  cp .env.template .env
  ```

- Finally open the ".env" file and set the required variables.

### Frontend

- Open FrontEnd folder

  ```
  cd FrontEnd
  ```

- Copy the ".env.template" file to ".env"

  ```
  cp .env.template .env
  ```

- Finally open the ".env" file and set the required variables. (variables should start with "VITE")

## Installation

```
git clone https://github.com/Gonza0922/NestJS-React-Real-Time-Chat
cd NestJS-React-Real-Time-Chat
npm install
npm run dev
```

## API Documentation

This project uses Swagger to generate the API documentation. Swagger provides a interface to explore and test the API endpoints.

### Accessing the API Documentation

- Ensure the backend server is running.
- Open your web browser and navigate to the following URL: http://localhost:3000/api-docs
- You should see the Swagger UI with the complete documentation of the API.

<h1 align="center">Capybara</h1>

<p align="center">A full-stack messaging app from <a href="https://www.theodinproject.com/lessons/nodejs-messaging-app">Odin</a></p>

## Demo: [Live](messaging-app-frontend-f0xb.onrender.com)

## Frontend built with

- Vite + React
- Websockets (Socket.io)
- React router v6
- CSS

### Dependencies

- **react**: library for building user interfaces
- **react-dom**: provides DOM-specific methods for rendering and managing React components within a web browser's Document Object Model
- **react-icons**: library of icons
- **react-router**: library designed specifically for React to handle client-side routing
- **socket.io-client**: library for frontend enabling real-time, bidirectional, and event-based communication between clients and a server

<br/><br/>

## Backend built with

- Node JS
- Express
- Passport
- Prisma ORM
- Cloudinary (will be added shortly)
- Multer (will be added shortly)

### Dependencies

- **@prisma/client**: auto-generated, type-safe query builder that provides an intuitive API for interacting with your database
- **bcrypt**: adaptive password-hashing function used to enhance security
- **cloudinary**: an API-first, cloud-based solution to manage images and videos for the web (will be added shortly)
- **cookie-parser**: makes it easy to read and manage cookies sent by the browser to the server.
- **cors**: allows a browser to request resources from a domain different from the one the browser originally loaded the page from
- **dotenv**: tool that loads environment variables, often containing sensitive information from a .env file
- **express**: unopinionated web framework for Node.js. It simplifies the process of building server-side applications and APIs
- **express-validator**: simplifies server-side input validation and sanitization
- **jsonwebtoken**: defines a compact and self-contained way for securely transmitting information between parties as a JSON object
- **socket.io**: library for backend enabling real-time, bidirectional, and event-based communication between clients and a server

<br/><br/>

## Clone and start the project

Here is how you can start the project locally.

Prerequisites:

- Installed psql
- Installed npm
  <br/><br/>

**1. Clone the repo**

```
#SSH
$ git clone git@github.com:fedewulff/messaging_app.git
```

**2. Download dependencies**

```
$ cd messaging_app/frontend
$ npm i

$ cd messaging_app/backend
$ npm i
```

**3. Create `.env` inside frondend and backend folder**

**4. Add the following to `.env` inside frontend folder**

```
VITE_BACKEND_URL="http://localhost:[PORT NUMBER FROM .env IN BACKEND]"
```

**5. Create postgresql database**

- `$ psql`
- 'CREATE DATABASE messaging_app;`

**6. Create Cloudinary account** (not necessary for now)

**7. Add the following to `.env` inside backend folder**

```
NODE_ENV="development"
PORT=[XXXX]
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/messaging_app"
FRONTEND_URL="http://localhost:[PORT RUNNING LOCAL DEV SERVER]"
ACCESS_TOKEN_SECRET= #create strong password
REFRESH_TOKEN_SECRET= #create strong password

CLOUDINARY_CLOUD_NAME (will be added shortly)
CLOUDINARY_API_KEY (will be added shortly)
CLOUDINARY_API_SECRET (will be added shortly)

```

**8. Start the project**

cd messaging_app/frontend `$ npm run dev`

cd messaging_app/backend `$ node --watch src/app.js `

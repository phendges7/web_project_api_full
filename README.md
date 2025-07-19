# Web Project API Full

This repository contains a complete web application project with both backend and frontend. It was developed to offer a well-structured and modern architecture using current technologies.

---

## 📖 Overview

The project is divided into two main directories:

- **Backend**: Manages server logic, authentication, RESTful API, and database integration.
- **Frontend**: User interface built with React, interacting with the API provided by the backend.

---

## ✨ Technologies Used

### Backend

- **Node.js**: Platform for running JavaScript on the server.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for data storage.
- **JWT (JSON Web Token)**: Authentication and authorization.
- **Mongoose**: ODM for modeling data in MongoDB.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool for React development.
- **CSS**: For interface styling.
- **ESLint**: Configuration to ensure code quality.

---

## 📂 Directory Structure

### Backend

- **`backend/app.js`**: Server entry file.
- **`backend/controllers`**: Contains controllers for business logic.
  - [cards.js](backend/controllers/cards.js)
  - [users.js](backend/controllers/users.js)
- **`backend/enums`**: Configuration enums, such as [http.js](backend/enums/http.js).
- **`backend/middlewares`**: Middlewares for specific treatments.
  - [auth.js](backend/middlewares/auth.js): Authentication middleware.
  - [errorHandler.js](backend/middlewares/errorHandler.js): Error handling middleware.
- **`backend/models`**: Data models for MongoDB.
  - [card.js](backend/models/card.js)
  - [user.js](backend/models/user.js)
- **`backend/routes`**: Manages application routes.
  - [cards.js](backend/routes/cards.js)
  - [users.js](backend/routes/users.js)
- **`backend/validators`**: Data input validations.
  - [cardsValidator.js](backend/validators/cardsValidator.js)
  - [usersValidator.js](backend/validators/usersValidator.js)

### Frontend

- **`frontend/src`**: Main React files.
  - **`components`**: Reusable components.
  - **`pages`**: Main application pages.
  - **`utils`**: Utility functions.
  - **`index.css`**: Global styles.
  - **`main.jsx`**: React entry file.
- **`frontend/public`**: Public files, like [vite.svg](frontend/public/vite.svg).

---

## 🚀 How to Run the Project

### Prerequisites

- Node.js installed (v16+).
- MongoDB configured and running locally or on a server.

### Backend

1. Go to the backend folder:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure environment variables in the `.env` file.
4. Start the server:
    ```bash
    npm start
    ```

### Frontend

1. Go to the frontend folder:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

---

## 🛠️ Features

1. **Authentication**:
    - Login with JWT.
2. **User Management**:
    - CRUD for user profiles.
3. **Card Management**:
    - Add, edit, like, and delete cards.
4. **Dynamic Frontend**:
    - Interactive and responsive interface built with React.

---

## 🆕 Proposed New Implementations

Here are some features that can be added to the frontend to further enhance user experience:

### 1. Favorites System

Add functionality to "favorite" or "save" important items for quick access later.

---

### 2. Animations and Transitions

Improve overall user experience by adding:

- Smooth animations during page navigation.
- Visual effects for feedback when clicking buttons or submitting forms.

---

### 3. Accessibility Components

Make the application more accessible to all users by implementing:

- Keyboard navigation.
- Screen reader support.
- High contrast options for visually impaired users.

**Benefits**:

- Ensures compliance with accessibility standards (WCAG).
- Improves experience for all users, regardless of limitations.

---

## Website Link

[WebApp deployed on VERCEL](https://web-project-api-full-ochre.vercel.app/)

## Demo Video Link

[Recording accessing the VERCEL platform](https://youtu.be/2tyRgOvAfU0)

## Author

Pedro Henrique

## Meta

This project demonstrates the use of ReactJS focused on popups and card creation, following good web development practices, pixel-perfect design, and advanced state management with hooks and context.  
It also demonstrates the use of Node.JS and Express.JS for backend, connected to the frontend through APIs.

## License

This project is free to use for educational and personal purposes.

## 📧 Contact

For questions or suggestions, contact:

- **Author**: [phendges7](https://github.com/phendges7)

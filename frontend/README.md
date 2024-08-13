# Complete Auth

This project is an example of a complete authentication system using React, Vite, Express, Mongoose, and Tailwind CSS.

## Installation

1. Clone the repository and navigate into the project directory.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file in the root directory and add the following variables:
   - `MONGODB_URI`: The MongoDB connection string.
   - `JWT_SECRET`: The secret key used to sign the JWT tokens.
   - `EMAIL_HOST`: The SMTP host for sending emails.
   - `EMAIL_PORT`: The SMTP port for sending emails.
   - `EMAIL_USERNAME`: The username for the SMTP server.
   - `EMAIL_PASSWORD`: The password for the SMTP server.
4. Run `npm run dev` to start the development server for the frontend.
5. In a separate terminal, navigate into the `backend` directory and run `npm run dev` to start the development server for the backend.

## Features

- User registration with email verification.
- User login with email/password and JWT authentication.
- Password reset with email verification and password reset.
- Protected routes and authentication middleware.

## Technologies Used

- React: A JavaScript library for building user interfaces.
- Vite: A fast build tool for modern web applications.
- Express: A minimalist web framework for Node.js.
- Mongoose: An Object-Document Mapping (ODM) library for MongoDB.
- Tailwind CSS: A utility-first CSS framework.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.



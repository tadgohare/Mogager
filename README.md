# Mogager

This is a fitness management tool used for fitness clubs to cater to the many diverse needs of clients, trainers, and other fitness staff. This application is for my database management class (COMP 3005 at Carleton University), and utilises PostgreSQL, and uses React for frontend and ExpressJS for the server side code.

## Running Instructions

1. Make sure you have NodeJS (Developped on Node 20.10.0 on Fedora 39) installed and clone the repository using your prefered cloning tool and `cd` into the root of the project.
2. Run `npm install` to install all of the dependencies needed to run this application.
3. Run `npm run init` (IS DIFFERENT FROM `npm init`), to run a script I created to initialize the environment variables, create the tables and to populate the database with some sample data.
4. Use the command `npm run build` to compile the React application into a `main.js` entry point.
5. Run `npm start` to start the server on your local network.

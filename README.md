## Project Requirements

`node 16.13.2`
`npm 8.1.2`
`react 18.2.0`
`express 4.18.2`


# Getting Started

In the `server` folder create a file `.env` and fill it out as in `.env.example`. Then install all dependencies via `npm install`. You can now start the server by running `node server.js`. The server will run on `http://localhost:4000`.

In the `client` folder create a file `.env` and fill it out as in `.env.example`. Then install all dependecies via `npm install`. You can now start the application by running the command `npm start`. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## How to use app

Before using the application, make sure that you are running the server.\
When you launch the app, you will be redirected to a login page, where you will need to log in with **Google**.\
After successful authentication you will get to the page where you need to fill in your card information for payments on **Stripe**.\
The next step is to choose 3 places. The first is the departure place, the second is the halfway point, and the third is the landing place.\
**The cost of the flight will be calculated as 1km = $1(min $50).**

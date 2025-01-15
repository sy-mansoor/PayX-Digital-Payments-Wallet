
# PayX-Digital Payments Wallet

The PayX is a Full-Stack Online wallet application created with the [MERN stack](https://www.geeksforgeeks.org/mern-stack/) ([MongoDB-Atlas](https://www.mongodb.com/cloud/atlas/register), [Express](https://expressjs.com/), [React](https://react.dev/), and [Node.js](https://nodejs.org/en)) that enables users to send and receive money, check their balance, and make payments. For managing transactions and learning more about spending patterns, it offers an intuitive user interface.


## Screenshots

![App Screenshot](https://ibb.co/jLFvvRJ)


## Features

- User Login
- User Register
- User Logout
- User Dashboard
- Profile Update
- Send Money
- Receive Money
- Money Request
- View Sent Transactions
- View Received Transactions
- View Money Requests Send From other Users
- Accept Money Request and Pay the Amount

## Tech Stack

**Front-end:** React is used to create the user interface.js was initialised with the help of Next.js, a well-known JavaScript package for creating dynamic websites.

**Server:** The server-side of the application is built with Node.js and Express.js, providing a scalable and robust foundation.

**Database:** MongoDB is utilized as the NoSQL database to store and retrieve financial data efficiently.


## Installation and Usage

To install and run the PayX Wallet Application locally, follow these steps:

## Step 1: Clone the repository


```
git clone <repositoru url>
```

### Step 2: Install dependencies

Navigate to the project root and install the necessary dependencies for `root`, `frontend` and `backend`:

```
npm install 

cd frontend
npm install

cd backend
npm install
```

after installation navigate to root and run:

```
npm run start
```
### Step 3: Configure the environment variables

- Create `.env` file in backend folder and add following variables

```
MONGO_URI = "<your-mongo-atlas-url>"

JWT_SECRET = <jwt-secret>
```




## Author

- [Syed Mansoor Ahmed](https://www.linkedin.com/in/symansoor/)


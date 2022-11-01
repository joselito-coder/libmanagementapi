// Configure Environment variables
require('dotenv').config();
const express = require("express");
const app = express();
const books = require("./routes/books.route");
const authors = require('./routes/authors.route');
const auth = require('./routes/auth.route');
const connectDb = require('./db/connect');

//  port to listen to
const port = process.env.PORT || 3000;


// Middlewares
app.use(express.json());


// routes
app.use('/api/v1/books', books);
app.use('/api/v1/authors',authors);
app.use('/api/v1/auth',auth);


app.get("/", (req, res) => {
  res.send("Please use /api/v1/books for books\n And /api/v1/author for authors");
});



// Start the app only if databse is connected
const start = async () => {
  try {

    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`the app has started on port ${port}`);
    });

  } catch (error) {

    console.error(error);

  }
}

start();
require('dotenv').config()
const app = require('./app')
const { connectToDB } = require('./config/db')

const port = process.env.PORT || 3000

// Start the server, after connecting to the database.
connectToDB()
  .then(() => {
    console.log("Database connected. Starting server...");
    app.listen(port, () => {
      console.log(`Finance Dashboard API is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed. Server will not start.");
    console.error(error);
    process.exit(1); // Exit the process if DB connection fails
  });
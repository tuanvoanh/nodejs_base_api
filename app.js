const bodyParser = require("body-parser")
const express = require("express");
const logger = require("morgan");
const mongoClient = require("mongoose");

// setup connect mongodb
mongoClient
  .connect("mongodb://localhost/nodejsBaseApi", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
  })
  .then(() => console.log("⚡ connect mongo success"))
  .catch(() => console.error("connect Fail"));

const app = express();

const userRoutes = require("./routes/user.js");
// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is Ok."
  });
});
app.use("/users", userRoutes);

// Catch 404 Error
app.use((req, res, next) => {
  const err = new Error("404 Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    // response to client
    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})

// Start server
const port = app.get("port") || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

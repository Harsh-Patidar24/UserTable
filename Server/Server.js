const express = require("express");
const cors = require("cors");
const app = express();
const Connection = require("./DB/Database")
const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");

app.use(express.json());

// connection to the database is here -------
Connection();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", authRoute);
app.use("/users", userRoute);

app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});

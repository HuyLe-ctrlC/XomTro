const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./routes/users/usersRoute");
const postRoutes = require("./routes/posts/postRoute");
const commentRoutes = require("./routes/comments/commentRoute");
const emailMsgRoutes = require("./routes/emailMsg/emailMsgRoute");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");
const categoryRoutes = require("./routes/categories/categoryRoute");
const app = express();
//DB
dbConnect();

//Middleware
app.use(express.json());
//cors
app.use(cors());
//User Route => using Middleware
app.use("/api/users", userRoutes);
//Post Route
app.use("/api/posts", postRoutes);
//Comment Route
app.use("/api/comments", commentRoutes);
//email msg Route
app.use("/api/email", emailMsgRoutes);
//category Route
app.use("/api/category", categoryRoutes);
//error handler
app.use(notFound);
app.use(errorHandler);
//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on ${PORT}`));

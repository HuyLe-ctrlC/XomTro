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
const locationRoutes = require("./routes/location/locationRoute");
const xomtroRoutes = require("./routes/xomtros/xomtrosRoute");
const roomRoutes = require("./routes/rooms/roomsRoute");
const invoiceRoutes = require("./routes/invoice/invoiceRoute");
const renterRoutes = require("./routes/renters/renterRoute");
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
//location Route
app.use("/api/location", locationRoutes);
//xomtro route
app.use("/api/xomtro", xomtroRoutes);
//room route
app.use("/api/room", roomRoutes);
//invoice route
app.use("/api/invoice", invoiceRoutes);
//invoice route
app.use("/api/renter", renterRoutes);
//error handler
app.use(notFound);
app.use(errorHandler);
//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on ${PORT}`));

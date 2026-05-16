const express = require("express");
const cors = require("cors");

const fieldsRoutes = require("./routes/fieldsRoutes");
const bookingsRoutes = require("./routes/bookingsRoutes");
const profileRoutes = require("./routes/profileRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("YallaPlay Dummy Backend is running");
});

app.use("/fields", fieldsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/profile", profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`YallaPlay Backend running on http://localhost:${PORT}`);
});

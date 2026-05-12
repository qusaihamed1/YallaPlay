const express = require("express");
const bookings = require("../data/bookings");

const router = express.Router();

router.post("/", (req, res) => {
  const { userId, fieldId, fieldName, date, time, duration, totalPrice, phone, email, paymentMethod } = req.body;

  if (!userId || !fieldName || !date || time === undefined) {
    return res.status(400).json({ message: "Missing required booking data" });
  }

  const alreadyBooked = bookings.some(
    (booking) => booking.fieldName === fieldName && booking.date === date && String(booking.time) === String(time)
  );

  if (alreadyBooked) {
    return res.status(409).json({ message: "This slot is already booked" });
  }

  const newBooking = {
    id: Date.now().toString(),
    userId,
    fieldId: fieldId || "",
    fieldName,
    date,
    time,
    duration: duration || 1,
    totalPrice: totalPrice || 0,
    phone: phone || "",
    email: email || "",
    paymentMethod: paymentMethod || "cash",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  res.status(201).json({ message: "Booking created successfully", booking: newBooking });
});

router.get("/", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.json(bookings);
  res.json(bookings.filter((booking) => booking.userId === userId));
});

router.put("/:id", (req, res) => {
  const bookingIndex = bookings.findIndex((booking) => booking.id === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found" });
  }

  bookings[bookingIndex] = { ...bookings[bookingIndex], ...req.body };
  res.json({ message: "Booking updated successfully", booking: bookings[bookingIndex] });
});

router.delete("/:id", (req, res) => {
  const bookingIndex = bookings.findIndex((booking) => booking.id === req.params.id);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found" });
  }

  bookings.splice(bookingIndex, 1);
  res.json({ message: "Booking deleted successfully" });
});

module.exports = router;

const express = require("express");
const fields = require("../data/fields");

const router = express.Router();

router.get("/", (req, res) => {
  const { sport } = req.query;
  if (sport) return res.json(fields.filter((field) => field.sport === sport));
  res.json(fields);
});

router.get("/search", (req, res) => {
  const searchText = String(req.query.q || "").trim().toLowerCase();
  if (!searchText) return res.json(fields);

  const result = fields.filter((field) =>
    field.name.toLowerCase().includes(searchText) ||
    field.location.toLowerCase().includes(searchText) ||
    field.sport.toLowerCase().includes(searchText)
  );

  res.json(result);
});

router.get("/:id", (req, res) => {
  const field = fields.find((item) => item.id === req.params.id);
  if (!field) return res.status(404).json({ message: "Field not found" });
  res.json(field);
});

module.exports = router;

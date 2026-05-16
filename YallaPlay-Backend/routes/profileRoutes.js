const express = require("express");
const profiles = require("../data/profiles");

const router = express.Router();

router.get("/:userId", (req, res) => {
  const profile = profiles.find((item) => item.userId === req.params.userId);
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  res.json(profile);
});

router.put("/:userId", (req, res) => {
  const profileIndex = profiles.findIndex((item) => item.userId === req.params.userId);

  if (profileIndex === -1) {
    const newProfile = { userId: req.params.userId, ...req.body };
    profiles.push(newProfile);
    return res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  }

  profiles[profileIndex] = { ...profiles[profileIndex], ...req.body };
  res.json({ message: "Profile updated successfully", profile: profiles[profileIndex] });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload");
const {
  createContact,
  getAllContacts,
} = require("../Controllers/contactController")

// router.post("/", createContact);
router.post("/", upload.single("file"), createContact);

router.get("/contact", getAllContacts);

module.exports = router;

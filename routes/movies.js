const express = require("express");
const router = express.Router();
const {
  index,
  search
} = require("../controllers/movies");


// index file
router.get(
    "",
    index
);

// search
router.get(
    "/search",
    search
);

module.exports = router;
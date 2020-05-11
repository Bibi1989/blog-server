const express = require("express");
const { register, login } = require("../controllers/users/usersAuthentication");
const router = express.Router();

/* GET users listing. */
router.post("/register", register);

router.post("/login", login);

module.exports = router;

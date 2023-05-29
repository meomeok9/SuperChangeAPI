const express = require("express");
const router = express.Router();
const userCtrl = require("../Controller/UserController");
router.post("/login", userCtrl.login);
router.post("/logout", userCtrl.logout);
router.get("/add-new-user", userCtrl.getAddNewUser);
router.post("/add-new-user", userCtrl.postRegister);
router.post("/delete-user", userCtrl.postDeleteUser);
module.exports = router;

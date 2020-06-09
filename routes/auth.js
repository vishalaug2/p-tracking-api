const express = require('express');
const router = express.Router();
const AM = require("./modules/auth-manager");

/* GET users listing. */
router.post('/login', function(req, res, next) {
  let username = req.body.username ? req.body.username.trim() : '';
  let password = req.body.password ? req.body.password.trim() : '';

  AM.checkLogin(username, password)
  .then((r) => {
    res.status(200).send(r);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
});

module.exports = router;
var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/info', passport.authenticate('access-token', { session: false }),
  function(req, res) {
    res.json({
    	userId: req.user.userId,
    	name: req.user.username,
    	scope: req.authInfo.scope
    });
  }
);

module.exports = router;
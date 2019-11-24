var express = require('express');
var router = express.Router();
var claimController = new (require('../controllers/ClaimController'))();

router.post('/', claimController.save);

module.exports = router;

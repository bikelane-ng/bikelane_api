var express = require('express');
var router = express.Router();
var driverController = new (require('../controllers/DriverController'))();

router.route('/')
  .get(driverController.getAll)
  .post(driverController.save);

router.get('/:id', driverController.getById);

module.exports = router;

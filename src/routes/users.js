var express = require('express');
var router = express.Router();
var userController = new (require('../controllers/UserController'))();

router.route('/')
  .get(userController.getAll)
  .post(userController.save);

router.get('/:id', userController.getById);

router.get('/location/user', userController.getUserLocation);

router.put('/location/update', userController.updateUserLocation);

module.exports = router;

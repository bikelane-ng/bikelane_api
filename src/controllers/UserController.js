const store = new (require("../repositories/UserStore"))(),
  utility = require("../helpers/utility");

function UserController () {
  this.store = store;

  this.save = (req, res) => {
    return this.store.save(req.body, utility.sendReponse(res));
  };

  this.getById = (req, res) => {
    return this.store.getById(req.params.id, utility.sendReponse(res));
  };

  this.getAll = (req, res) => {
    return this.store.get({}, utility.transformListAndSendResponse(res));
  };

}

module.exports = UserController;

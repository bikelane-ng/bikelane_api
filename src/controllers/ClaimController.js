const store = new (require("../repositories/ClaimStore"))(),
  utility = require("../helpers/utility");

function ClaimController() {
  this.store = store;

  this.save = (req, res) => {
    return this.store.save(req.body, utility.sendReponse(res));
  };

}

module.exports = ClaimController;

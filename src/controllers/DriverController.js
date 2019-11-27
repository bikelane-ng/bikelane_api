const store = new (require("../repositories/UserStore"))(),
  roleStore = new (require("../repositories/RoleStore"))(),
  utility = require("../helpers/utility");

function DriverController() {
  this.store = store;

  this.getDriverRole = callback => {
    return roleStore.getOne({ name: "DRIVER" }, callback);
  }

  this.save = (req, res) => {
    return this.getDriverRole((error, role) => {
      if (error) return utility.sendErrorResponse(res, error);

      req.body.role = role._id;
      return this.store.save(req.body, utility.sendReponse(res));
    });
  };

  this.getById = (req, res) => {
    return this.store.getById(req.params.id, utility.sendReponse(res));
  };

  this.getAll = (req, res) => {
    return this.getDriverRole((error, role) => {
      if (error) return utility.sendErrorResponse(res, error);

      return this.store.get({ role: role._id }, utility.transformListAndSendResponse(res));
    });
  };

}

module.exports = DriverController;

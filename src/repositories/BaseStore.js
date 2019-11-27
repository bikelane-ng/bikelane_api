function BaseStore() {
  this.model = {};
}

BaseStore.prototype.save = function (doc, options, callback) {
  confirmArguments(arguments, 3, () => {
    callback = options;
    options = null;
  });
  new this.model(doc).save(options, callback);
};

BaseStore.prototype.update = function (query, doc, options, callback) {
  confirmArguments(arguments, 4, () => {
    callback = options;
    options = null;
  });
  this.model.update(query, { $set: doc }, options, callback);
};

BaseStore.prototype.get = function (query, projections, callback) {
  confirmArguments(arguments, 3, () => {
    callback = projections;
    projections = null;
  });
  this.model.find(query, projections, callback);
};

BaseStore.prototype.getById = function (id, projections, callback) {
  confirmArguments(arguments, 3, () => {
    callback = projections;
    projections = null;
  });
  this.model.findById(id, projections, callback);
};

BaseStore.prototype.getOne = function (query, projections, callback) {
  confirmArguments(arguments, 3, () => {
    callback = projections;
    projections = null;
  });
  this.model.findOne(query, projections, callback);
};

module.exports = BaseStore;


function isNotFullArguments(arguments, expectedLength) {
  return !(arguments.length >= expectedLength);
}

function confirmArguments(arguments, expectedLength, fn) {
  if (isNotFullArguments(arguments, expectedLength)) {
    fn();
  }
};
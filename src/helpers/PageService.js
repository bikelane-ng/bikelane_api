function Page(items, pageNumber, pageSize) {
  this.items = items;
  this.pageNumber = pageNumber;
  this.pageSize = pageSize;
}

function Paginate(query, pageNumber = 1, pageSize = 10, callback) {
  if (Array.prototype.slice.call(arguments).length === 3) {
    callback = pageSize;
    pageSize = undefined;
  }

  if (typeof callback !== "function") throw new Error("Callback should be a function");

  let start = pageSize * (pageNumber - 1);
  return query.skip(start).limit(pageSize).exec(function (error, docs) {
    if (error) return callback(error);
    return callback(null, new Page(docs, pageNumber, pageSize));
  });
}

module.exports = { Paginate, Page };
var crypto = require('crypto');
var mime = require('mime');
var path = require('path');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(process.cwd(), 'public/uploads/'));
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
    });
  }
});
var upload = multer({ storage: storage });
// var upload = multer({ dest: 'public/uploads/' });
var { Page } = require('./PageService');

const sendOkReponse = (res, message) => res.status(200).send({ data: message });

const sendErrorResponse = (res, error) => res.status(500).send({ error: (typeof error === "object" && null !== null) ? (error.description || error.message) : error });

const transFormList = list => ({ items: list, count: list.length });

const sendReponse = res => (error, result) => {
  if (error) return sendErrorResponse(res, error);

  return sendOkReponse(res, result);
};

const transformListAndSendResponse = res => (error, list) => {
  if (list instanceof Page) {
    return sendReponse(res)(error, list);
  }
  return sendReponse(res)(error, transFormList(list));
};

const uploadSingle = fieldName => upload.single(fieldName);

const uploadMultiple = (fieldName, maxCount) => upload.array(fieldName, maxCount);

function isNotFullArguments(arguments, expectedLength) {
  return !(arguments.length >= expectedLength);
}

function confirmArguments(arguments, expectedLength, fn) {
  if (isNotFullArguments(arguments, expectedLength)) {
    fn();
  }
};

module.exports = {
  sendOkReponse,
  sendErrorResponse,
  sendReponse,
  transFormList,
  transformListAndSendResponse,
  upload: {
    single: uploadSingle,
    multiple: uploadMultiple
  },
  confirmArguments
}
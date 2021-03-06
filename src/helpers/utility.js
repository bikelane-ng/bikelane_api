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

const sendErrorResponse = (res, error) => res.status(500).send({ error: (typeof error === "object" && error !== null) ? (error.description || error.message) : error });

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

function encrypt(data) {
  let iv = crypto.randomBytes(32);

  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(config.auth.secret), iv);

  let encryptedData = cipher.update(data);

  encryptedData = Buffer.concat([encryptedData, cipher.final()]).toString("hex");

  return {
    iv: iv.toString('hex'),
    encryptedData
  };
}

function decrypt(data) {
  const decipher = crypto.createDecipheriv("aes-256-gcm",
    Buffer.from(config.auth.secret), Buffer.from(data.iv, 'hex'));

  let decrypted = crypto.update(data.encryptedData);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

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
  confirmArguments,
  encrypt,
  decrypt
}
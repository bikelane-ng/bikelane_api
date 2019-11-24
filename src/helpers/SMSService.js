const options = {
  apiKey: process.env.SMS_API_KEY,
  username: process.env.SMS_API_USERNAME
};

const AfricasTalking = require('africastalking')(options),
  SMS = AfricasTalking.SMS;

function SMSService() {

  this.sendSMS = (recipients = [], message = "", callback) => {
    const options = {
      to: recipients,
      message
    };

    return SMS.send(options)
      .then(res => callback(null, res))
      .catch(error => callback(error));
  };
}

module.exports = SMSService;
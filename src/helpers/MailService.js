const nodemailer = require('nodemailer'),
  config = require('../../config')[process.env.NODE_ENV],
  templatingService = new (require('./TemplatingService'))();

module.exports = class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport(config.mail);
  }

  getTemplate = (context, template = "emails/default.jade") => {
    return templatingService.render(template, context);
  };

  sendEmail = async ({
    from = '"no-reply Bikelane" <no-reply@bikelane.com>',
    to,
    subject,
    context = {},
    template
  }) => {
    if (!to) throw new Error("Recipient is required");
    if (!subject) throw new Error("Subject is required");

    return await this.transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join() : to, // list of receivers
      subject: subject,
      html: this.getTemplate(context, template)
    });
  };

}
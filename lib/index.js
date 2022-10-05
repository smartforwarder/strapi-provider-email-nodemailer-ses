'use strict';
const nodemailer = require('nodemailer');
const aws = require('@aws-sdk/client-ses');

module.exports = {
  init: (providerOptions = {}, settings = {}) => {
    const ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: 'us-east-1',
      // id and key will be read from env file
      // AWS_ACCESS_KEY_ID
      // AWS_SECRET_ACCESS_KEY
      //accessKeyId: providerOptions.key,
      //secretAccessKey: providerOptions.secret,
    });

    // create Nodemailer SES transporter
    const transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });

    return {
      send: async options => {
        const { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options;

        const msg = {
          from: from || settings.defaultFrom,
          to,
          cc,
          bcc,
          replyTo: replyTo || settings.defaultReplyTo,
          subject,
          text,
          html,
          ...rest,
        };

        await transporter.sendMail(msg);
      },
    };
  },
};

'use strict';

const nodemailer = require('nodemailer');

function sendRecoveryPassword(sendToEmail, password) {
  const en = '<p>You have required a new password. Your new password is: ' + password + '</p>';
  const pt = '<p>Você solicitou uma nova senha. Sua nova senha de acesso é: ' + password + '</p>';
  const mailOptions = {
    to: sendToEmail,
    subject: 'GotMoney App - new password',
    html: pt + '<br/>' + en
  };
  return sendEmail(mailOptions);
}

function sendNewUser(sendToEmail, password) {
  const en = '<p>You have created an account into GotMoney App website. Your password is: ' + password + '</p>';
  const pt = '<p>Você criou uma conta no website GotMoney App. Sua senha de acesso é: ' + password + '</p>';
  const mailOptions = {
    to: sendToEmail,
    subject: 'GotMoney App - new user',
    html: pt + '<br/>' + en
  };
  return sendEmail(mailOptions);
}

function sendEmail(mailOptions) {
  return getTransporter().sendMail(mailOptions);
}

function getTransporter() {
  const transportOptions = {
    port: process.env.EMAIL_PORT,
    host: process.env.EMAIL_HOST,
    secure: true,
    disableFileAccess: true,
    disableUrlAccess: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  };
  return nodemailer.createTransport(transportOptions, {from: process.env.EMAIL_FROM});
}

module.exports = {
  sendRecoveryPassword,
  sendNewUser
};

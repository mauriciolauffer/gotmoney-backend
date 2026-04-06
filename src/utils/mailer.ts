import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface MailerConfig {
  EMAIL_PORT?: string;
  EMAIL_HOST?: string;
  EMAIL_USER?: string;
  EMAIL_PASSWORD?: string;
  EMAIL_FROM?: string;
}

export function sendRecoveryPassword(
  sendToEmail: string,
  password: string,
  config: MailerConfig,
): Promise<any> {
  const en = "<p>You have required a new password. Your new password is: " + password + "</p>";
  const pt = "<p>Você solicitou uma nova senha. Sua nova senha de acesso é: " + password + "</p>";
  const mailOptions: MailOptions = {
    to: sendToEmail,
    subject: "GotMoney App - new password",
    html: pt + "<br/>" + en,
  };
  return sendEmail(mailOptions, config);
}

export function sendNewUser(
  sendToEmail: string,
  password: string,
  config: MailerConfig,
): Promise<any> {
  const en =
    "<p>You have created an account into GotMoney App website. Your password is: " +
    password +
    "</p>";
  const pt =
    "<p>Você criou uma conta no website GotMoney App. Sua senha de acesso é: " + password + "</p>";
  const mailOptions: MailOptions = {
    to: sendToEmail,
    subject: "GotMoney App - new user",
    html: pt + "<br/>" + en,
  };
  return sendEmail(mailOptions, config);
}

function sendEmail(mailOptions: MailOptions, config: MailerConfig): Promise<any> {
  return getTransporter(config).sendMail(mailOptions);
}

function getTransporter(config: MailerConfig): any {
  const transportOptions = {
    port: parseInt(config.EMAIL_PORT || "465"),
    host: config.EMAIL_HOST,
    secure: true,
    disableFileAccess: true,
    disableUrlAccess: true,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
  };
  return nodemailer.createTransport(transportOptions as any, { from: config.EMAIL_FROM });
}

export default {
  sendRecoveryPassword,
  sendNewUser,
};

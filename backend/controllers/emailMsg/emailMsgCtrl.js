const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const EmailMsg = require("../../model/emailMessaging/emailMessaging");
const Filter = require("bad-words");
const ResetURL = require("../../utils/resetURL");
/*-------------------
//TODO: Send Email Message
//-------------------*/

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { email } = req.user;
  const { to, subject, message } = req.body;
  //get the message
  const emailMessage = subject + " " + message;
  //prevent profane/bad words
  const filter = new Filter(email);
  const isProfane = filter.isProfane(emailMessage);
  if (isProfane) {
    throw new Error("Email send failed, because it contains profane words");
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });
    const msg = {
      from: `${process.env.EMAIL}`, // Sender email
      to, // Receiver email
      subject, // Title email
      html: `<p>${message}</p>`, // Text in email
    };
    await transporter.sendMail(msg);
    await EmailMsg.create({
      sendBy: req?.user?._id,
      from: req?.user?.email,
      to,
      message,
      subject,
    });
    res.json("email sent");
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMsgCtrl };

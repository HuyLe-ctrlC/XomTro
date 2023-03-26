const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const EmailMsg = require("../../model/emailMessaging/emailMessaging");
const Filter = require("bad-words");
const sendMessage = require("../../utils/sendMessage");
/*-------------------
//TODO: Send Email Message
//-------------------*/

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { email, firstName, lastName, _id } = req.user;
  const { to, subject, message } = req.body;
  //get the message
  const emailMessage = subject + " " + message;
  //get full name
  const fullName = firstName + " " + lastName;
  //prevent profane/bad words
  const filter = new Filter(email);
  const isProfane = filter.isProfane(emailMessage);
  if (isProfane) {
    throw new Error("Gửi email thất bại! Email có chứa từ ngữ không phù hợp!");
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
      // html: `<p>${message}</p>`, // Text in email
      html: sendMessage(_id, fullName, message),
    };
    await transporter.sendMail(msg);
    await EmailMsg.create({
      sendBy: req?.user?._id,
      from: req?.user?.email,
      to,
      message,
      subject,
    });
    res.json({ result: true, message: "Đã gửi email thành công!" });
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMsgCtrl };

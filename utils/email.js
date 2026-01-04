const nodeMailer = require("nodemailer");
const { verficationEmailTemplate } = require("./template");
require("dotenv").config()

const getSubject = (emailType) => {
    switch (emailType) {
        case "forget":
            return "LOREPA - Forget Password Email";
        default:
            return "NGOC - Account Verification Email";
    }
};

const selectTemplate = (emailType, name,otp) => {
    switch (emailType) {
        case "forget":
            return verficationEmailTemplate(name,otp);
        default:
            return verficationEmailTemplate(name,otp);
    }
};

const sendDynamicMail = async (mailType, email, name,otp) => {
    try {
        let transporter = await nodeMailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true,auth: { user:"Vpngocanh77@gmail.com", pass:"poutxfajidxdozzx", } });
        let html = await selectTemplate(mailType, name,otp);
        mailOptions = { from: "<no-reply@lorepa.com>", to: email, subject: getSubject(mailType), html: html };
        await transporter.sendMail(mailOptions);
        return { status: 200, message: "Email sent successfully", };
    }
    catch (err) {
        console.log("error in sending dynamic email Functions", err)
        return { status: 500, message: err, };
    }
}

module.exports = { sendDynamicMail }
const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
     host: 'smtp-mail.outlook.com',
    port: 587,
    secure:false,
    auth:{
        user: process.env.EMAIL_FROM,
        pass: process.env.PASS_EMAIL,
    },
    tls:{
        ciphers:'SSLv3',
        rejectUnauthorized:false,
    },
});


async function enviarCorreo(to,subject,text){

    await transporter.sendMail({
        from:process.env.EMAIL_FROM,
        to,
        subject,
        text
    })
}
module.exports={enviarCorreo}
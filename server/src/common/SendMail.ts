import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export type SendMailProps={
    emailFrom?: string,
    emailTo?: string
    content?: string,
    subject?: string,
    text?:string,
    data?: any,
    html?: string,
}
const SendMail = async (props: SendMailProps) => {
    const host = process.env.EMAIL_HOST;
    const username = process.env.EMAIL_USERNAME;
    const password = process.env.EMAIL_PASSWORD;
    const transporter = nodemailer.createTransport({
        host: host,
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: username,
            pass: password,
        },
        logger: true,
    });
    const info = await transporter.sendMail({
        from: props.emailFrom ?? 'No replies <hocphisinhvien@gmail.com>',
        to: props.emailTo ?? 'hocphisinhvien@gmail.com',
        subject: props.subject ?? '',
        text: props.text ?? '',
        html: props.html ?? '',
        headers: { 'x-cloudmta-class': 'standard' },
    });
    console.log('Message sent: %s', info.response);
}

export default SendMail;
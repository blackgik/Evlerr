import sgMail from "@sendgrid/mail";
import config from "config";
sgMail.setApiKey(config.get<string>("sendgridKey"));

type msgData = {
	to: string;
	from: string;
	subject: string;
	text: string;
	html: string;
};

async function emailVerification(
	email: string,
	subject: string,
	token: string,
) {
	const msg: msgData = {
		to: email,
		from: config.get<string>("emailSender"),
		subject,
		text: `HELLO THERE,\n please, kindly copy the link below to verify your email\n\n http://localhost:3000?token=${token}`,
		html: `<strong>Hello There,</strong>
               <p>please, kindly click <a href="http://localhost:3000?token=${token}"><b>here<b></a> to verify account </p><br>
               <p>you can also copy this link and post on your browser<em>http://localhost:3000?token=${token}<em></p>`,
	};

	try {
		await sgMail.send(msg);
		console.log("Email sent successfully");
	} catch (err: any) {
		console.log(err);
	}
}

export default emailVerification;

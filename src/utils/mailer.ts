import sgMail from "@sendgrid/mail";
import config from "config";
import { BadRequestError } from "../../lib/appErrors";
import logger from "./logger";
sgMail.setApiKey(config.get<string>("sendgridKey"));

type msgData = {
	to: string;
	from: string;
	subject: string;
	text: string;
	html: string;
};

async function emailVerification(email: string, subject: string, token: string) {
	const msg: msgData = {
		to: email,
		from: config.get<string>("emailSender"),
		subject,
		text: `HELLO THERE,\n please, kindly copy the link below to verify your email\n\n http://localhost:3000/api/v1/auth/verfity-token?token=${token}`,
		html: `<strong>Hello There,</strong>
               <p>please, kindly click <a href="http://localhost:3000/api/v1/auth/verfity-token?token=${token}"><b>here<b></a> to verify account </p><br>
               <p>you can also copy this link and post on your browser<em>http://localhost:3000/api/v1/auth/verfity-token?token=${token}<em></p>`
	};

	try {
		await sgMail.send(msg);
		logger.info("Email sent successfully");
	} catch (err: any) {
		logger.error(err);
	}
}

async function passwordValidationMail(email: string, subject: string, token: string) {
	const msg: msgData = {
		to: email,
		from: config.get<string>("emailSender"),
		subject,
		text: `HELLO THERE,\n please, kindly copy the link below to change your email\n\n http://localhost:3000/api/v1/auth/reset-password?token=${token}`,
		html: `<strong>Hello There,</strong>
               <p>please, kindly click <a href="http://localhost:3000/api/v1/auth/reset-password?token=${token}"><b>here<b></a> to verify account </p><br>
               <p>you can also copy this link and post on your browser<em>http://localhost:3000/api/v1/auth/reset-password?token=${token}<em></p>`
	};

	try {
		await sgMail.send(msg);
		logger.info("Email sent successfully");
	} catch (err: any) {
		logger.error(err);
	}
}

async function agentSupportMail(
	email: string,
	subject: string,
	phone: string,
	message: string,
	name: string,
	sender: string
) {
	
	const msg: msgData = {
		to: email,
		from: config.get<string>("emailSender"),
		subject,
		text: `${message} \n\n\n

		Contact details\n
		
		Sender email: ${sender}\n
		phone: ${phone}\n
		name: ${name}\n
	
		`,
		html: `<p>${message}</p>
			   <br><br>
			   <h4>Contact details<h4>
			   <ul>
			   <li>Sender email: ${sender}</l1>
			   <li>phone: ${phone}</l1>
			   <li>name: ${name}</l1>
	`
	};

	try {
		await sgMail.send(msg);
		logger.info("Email sent successfully");
		return true
	} catch (err: any) {
		logger.error(err);
		return false
	}
}

export { emailVerification, passwordValidationMail, agentSupportMail };

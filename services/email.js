const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text');

/**
 * @brief email service
 */
class Email {
	constructor(user, url){
		this.to = user.email;
		this.name = user.name;
		this.url = url;
		this.from = `Tran Phuc <${process.env.EMAIL_FROM}>`

	}

	/**
	 * @desc create new transporter to send mail
	 * @return {nodemailer.Transporter}
	 */
	newTransport(){
		if (process.env.NODE_ENV === 'production'){
			// TODO: use your mail service
			return nodemailer.createTransport({
				service: '{{Your_mail_service_here}}',
				auth: {
					// TODO: authenticate service
				}
			})

		}

		// For dev testing
		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			}
		})
	}

	/**
	 * @desc send mail helper
	 * 
	 * @param {String} template - name of template view in views/email folder
	 * @param {String} subject - Subject of sended email
	 * @return {Promise<void>}
	 */
	async send(template, subject){
		// 1) Render html based on pug template
		const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
			name: this.name,
			url: this.url,
			subject
		});

		// 2) Email options
		const mail_options = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html)
		}

		// 3) send mail
		await this.newTransport().sendMail(mail_options);
	}

	// Send mail for each case

	/**
	 * @desc send welcome email on signing up
	 */
	async sendWelcome(){
		await this.send('welcome', 'Welcome to my app!');
	}
}

module.exports = Email;
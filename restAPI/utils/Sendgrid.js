const sendgrid = require('@sendgrid/mail');

class Sendgrid {
    constructor(to, from, subject) {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        this.to = to
        this.from = from
        this.subject = subject
    }

    sendMail(content) {
        sendgrid.send({ to: this.to, from: this.from, subject: this.subject, text: content })
    }

    sendAccountEmail(action, username) {
        let html = ""
        switch (action) {
            case "create":
                html = this._accountHTML("Account Created", `Welcome ${username} to Find Your Word! Your account has been successfully created.`)
                break
            case "delete":
                html = this._accountHTML("Account Removed", `Good by ${username}... Your account has been successfully deleted.`)
                break
            case "update_password":
                html = this._accountHTML("Account Password Updated", `Welcome ${username} to Find Your Word! Your password has been successfully updated.`)
                break
            case "update_profile":
                html = this._accountHTML("Account Profile Updated", `Welcome ${username} to Find Your Word! Your profiles has been successfully updated.`)
                break
            default:
                throw Error(`Unexisting action : ${action}`)
        }

        sendgrid.send({
            to: this.to,
            from: this.from,
            subject: this.subject,
            html: html
        })
    }

    _accountHTML(title, content) {
        return `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f3f3f3;
                }
        
                .container {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
        
                h1 {
                    color: #333;
                }
        
                p {
                    color: #777;
                    line-height: 1.5;
                }
        
                .cta-button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 3px;
                }
        
                .cta-button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${title}</h1>
                <p>${content}</p>
                <a class="cta-button" href="#">Accéder à mon compte</a>
            </div>
        </body>
        </html>
        `
    }
}

module.exports = Sendgrid

import nodemailer from 'nodemailer'
import config from '../utils/config'

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: false,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
})

const createEmailTemplate = (content: string, currentYear: number) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.APP_NAME}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f9fa;
            color: #212529;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .card {
            background-color: #ffffff;
            border-radius: 16px;
            padding: 48px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        h1 {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 24px 0;
            color: #212529;
            letter-spacing: -0.5px;
            line-height: 1.3;
        }
        p {
            margin: 0 0 20px 0;
            color: #495057;
            font-size: 16px;
        }
        .code-container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 16px;
            padding: 32px 24px;
            text-align: center;
            margin: 40px 0;
        }
        .code {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 12px;
            color: #212529;
            margin: 0;
            text-align: center;
            display: block;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .warning {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border-radius: 12px;
            padding: 20px;
            margin: 32px 0;
        }
        .warning p {
            color: #71640b;
            margin: 0;
            font-size: 15px;
            font-weight: 500;
        }
        .footer {
            text-align: center;
            margin-top: 48px;
            padding-top: 32px;
            border-top: 2px solid #f8f9fa;
        }
        .footer p {
            color: #6c757d;
            font-size: 12px;
            margin: 8px 0;
        }
        .muted {
            color: #6c757d;
            font-size: 12px;
            line-height: 1.6;
        }
        table {
            border-collapse: collapse;
        }
        @media only screen and (max-width: 640px) {
            .container {
                padding: 20px 16px;
            }
            .card {
                padding: 40px 24px;
                border-radius: 12px;
            }
            .code {
                font-size: 28px;
                letter-spacing: 8px;
            }
            .code-container {
                padding: 24px 16px;
            }
            h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td>
                <div class="container">
                    <div class="card">
                        ${content}
                        <div class="footer">
                            <p><strong>${config.APP_NAME} Team</strong></p>
                            <p>© ${currentYear} ${config.APP_NAME}. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
`

const sendVerificationEmail = async (email: string, code: string, name: string) => {
  const content = `
    <h1>Welcome to ${config.APP_NAME}, ${name}!</h1>
    <p>To get started, please verify your email address using the verification code below.</p>

    <div class="code-container">
        <div class="code">${code}</div>
    </div>

    <div class="warning">
        <p>This verification code will expire in 10 minutes.</p>
    </div>

    <p class="muted">If you didn't create an account with ${config.APP_NAME}, you can safely ignore this email. Your email address will not be used for anything else.</p>
  `

  const mailOptions = {
    from: `"${config.APP_NAME}" <${config.SENDER_EMAIL}>`,
    to: email,
    subject: `Verify Your Email Address - Welcome to ${config.APP_NAME}`,
    html: createEmailTemplate(content, new Date().getFullYear()),
  }

  await transporter.sendMail(mailOptions)
}

const sendWelcomeEmail = async (email: string, name: string) => {
  const content = `
    <h2>Welcome, ${name}! 🎉</h2>
    <p>Your email has been successfully verified. You now have full access to your account.</p>
    <p>Thank you for joining us!</p>
  `

  const mailOptions = {
    from: `"${config.APP_NAME}" <${config.SENDER_EMAIL}>`,
    to: email,
    subject: 'Welcome! Your Email is Verified',
    html: createEmailTemplate(content, new Date().getFullYear()),
  }

  await transporter.sendMail(mailOptions)
}

export default {
  sendVerificationEmail,
  sendWelcomeEmail,
}

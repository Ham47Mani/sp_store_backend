

// ----- Verify Email Template -----
export const EmailTemplates = {
  verification: (customerEmail: string, customerName: string, otp: string) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f0f0f0;
                  margin: 0;
                  padding: 0;
              }
              .email-container {
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background-color: #546ef5;
                  color: #ffffff;
                  padding: 20px;
                  text-align: center;
                  font-size: 24px;
                  border-radius: 8px 8px 0 0;
              }
              .content {
                  padding: 20px;
                  text-align: center;
                  color: #333333;
              }
              .content p {
                  margin: 0 0 20px;
              }
              .otp-button {
                  background-color: #546ef5;
                  color: #ffffff;
                  border: none;
                  padding: 15px 30px;
                  font-size: 18px;
                  text-decoration: none;
                  border-radius: 5px;
                  cursor: pointer;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  Welcome to SP_STORE
              </div>
              <div class="content">
                  <p>Hey <strong>${customerName}</strong>,</p>
                  <p>Wowwee! Thanks for registering an account with Digizone! You're the coolest person in all the land (and I've met a lot of really cool people).</p>
                  <p>Before we get started, we'll need to verify your email (<strong>${customerEmail}</strong>).</p>
                  <p>Your OTP is :</p>
                  <p class="otp-button">${otp}</p>
              </div>
          </div>
      </body>
    </html>

  `,
  passwordReset: (customerName: string, customerEmail: string, newPassword: string, loginLink: string) => `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                }
                .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                color: #333333;
                font-size: 24px;
                }
                p {
                color: #666666;
                font-size: 16px;
                line-height: 1.5;
                }
                .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                background-color: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                }
                .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #999999;
                text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>The New Password</h1>
                <p>Hi <strong>${customerName}</strong>,</p>
                <p>We received a request to reset the password for your account associated with <strong>${customerEmail}</strong>.</p>
                <p>Your new temporary password is:</p>
                <p><strong>${newPassword}</strong></p>
                <p>For your security, please use the following link to log in and change your password:</p>
                <a href="${loginLink}" class="button">Log in to Your Account</a>
                <p>If you didn’t request a password reset, please ignore this email or contact support if you have any concerns.</p>
                <p>Thank you,</p>
                <p>The SP_STORE Team</p>
                
                <div class="footer">
                <p>If you have any issues, please contact us at support@spaidertech.com</p>
                </div>
            </div>
        </body>
    </html>
  `,
  welcome: ``,
}
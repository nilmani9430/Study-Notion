exports.passwordUpdated = (name,email) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Password Updated Confirmation</title>
      <style>
        body {
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
    
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 15px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          font-family: 'Arial', sans-serif;
        }
    
        .header {
          text-align: center;
          background-color: #FFD700;
          padding: 10px 0;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }
    
        h1 {
          color: #333;
          font-size: 36px;
          margin: 10px 0;
        }
    
        p {
          color: #666;
          font-size: 18px;
          line-height: 1.6;
          text-align: center;
        }
    
        strong {
          color: #333;
          font-weight: bold;
        }
    
        .btn {
          display: inline-block;
          background-color: #FFD700;
          color: #333;
          padding: 15px 30px;
          text-align: center;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          font-size: 20px;
          margin-top: 20px;
        }
    
        .footer {
          background-color: #333;
          padding: 20px;
          color: #FFF;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Study Notion</h1>
          <p>Your Path to Knowledge</p>
        </div>
        <h1>Password Updated Confirmation</h1>
        <p>Hello ${name},</p>
        <p>Your password has been successfully updated for the email address ${email}.</p>
        <p>If you didn't make this change or need further assistance, please contact us immediately.</p>
        <p style="text-align: center;"><a href="[login_link]" class="btn">Log In</a></p>
      </div>
      <div class="footer">
        &copy; 2023 Study Notion. All rights reserved.
      </div>
    </body>
    </html>
    `
}
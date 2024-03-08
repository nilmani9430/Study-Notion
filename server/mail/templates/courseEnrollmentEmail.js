exports.courseEnrollmentEmail = (courseName,name) => {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Course Enrollment Confirmation</title>
      <style>
        /* Add your styling here */
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
        <h1>Course Enrollment Confirmation</h1>
        <p>Hello ${name},</p>
        <p>You've successfully enrolled in the following course:</p>
        <p><strong>Course Name: ${courseName}</strong></p>
        <p>Thank you for choosing our course! If you have any questions or need assistance, please don't hesitate to contact us.</p>
        <p style="text-align: center;"><a href="#" class="btn">Visit our Website</a></p>
      </div>
      <div class="footer">
        &copy; 2023 Study Notion. All rights reserved.
      </div>
    </body>
    </html>
    `
}
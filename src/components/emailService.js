/* emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail', // or use your preferred SMTP provider
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_APP_PASSWORD  // Gmail app password (not regular password)
      }
    });
/*
    this.transporter = nodemailer.createTransporter({
      host: 'your-smtp-server.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
*/ /*   
  }

  async sendVacationRequestNotification(managerEmail, managerName, employeeName, employeeDepartment, startDate, endDate, reason) {
    const subject = `🏖️ Νέο Αίτημα Άδειας από ${employeeName}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #495057; }
          .value { color: #212529; font-weight: 500; }
          .reason-box { background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; }
          .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; margin: 20px 5px; font-weight: 600; }
          .urgent { color: #dc3545; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Νέο Αίτημα Άδειας</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Απαιτείται η έγκρισή σας</p>
          </div>
          <div class="content">
            <p>Αγαπητέ/ή <strong>${managerName}</strong>,</p>
            
            <p>Έχετε λάβει ένα νέο αίτημα άδειας που απαιτεί την άμεση εξέτασή σας:</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">👤 Υπάλληλος:</span>
                <span class="value">${employeeName}</span>
              </div>
              <div class="detail-row">
                <span class="label">🏢 Τμήμα:</span>
                <span class="value">${employeeDepartment}</span>
              </div>
              <div class="detail-row">
                <span class="label">📅 Από:</span>
                <span class="value">${new Date(startDate).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="label">📅 Έως:</span>
                <span class="value">${new Date(endDate).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="label">⏱️ Συνολικές Ημέρες:</span>
                <span class="value">${Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} ημέρες</span>
              </div>
            </div>
            
            <div class="reason-box">
              <strong>💭 Αιτιολογία:</strong><br><br>
              ${reason}
            </div>
            
            <p style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">
                🔍 Σύνδεση στο Σύστημα
              </a>
            </p>
            
            <p class="urgent">⚠️ Παρακαλώ συνδεθείτε στο σύστημα για να εγκρίνετε ή να απορρίψετε το αίτημα το συντομότερο δυνατό.</p>
          </div>
          <div class="footer">
            <p>Αυτό το email στάλθηκε αυτόματα από το Σύστημα Διαχείρισης Αδειών.<br>
            Παρακαλώ μην απαντήσετε σε αυτό το email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Σύστημα Αδειών" <${process.env.EMAIL_USER}>`,
      to: managerEmail,
      subject: subject,
      html: htmlContent
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Vacation request notification sent to manager: ${managerEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to send vacation request notification:', error);
      return { success: false, error: error.message };
    }
  }

  async sendVacationDecisionNotification(employeeEmail, employeeName, status, startDate, endDate, reviewerName, reviewDate, reason) {
    const isApproved = status === 'approved';
    const statusText = isApproved ? 'Εγκρίθηκε' : 'Απορρίφθηκε';
    const statusEmoji = isApproved ? '✅' : '❌';
    const statusColor = isApproved ? '#28a745' : '#dc3545';
    const statusBg = isApproved ? '#d4edda' : '#f8d7da';
    
    const subject = `${statusEmoji} Το αίτημα άδειάς σας ${statusText.toLowerCase()}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusColor}; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-badge { background: ${statusBg}; color: ${statusColor}; padding: 15px 20px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; border: 2px solid ${statusColor}; }
          .details { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #495057; }
          .value { color: #212529; font-weight: 500; }
          .reason-box { background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; }
          .next-steps { background: ${isApproved ? '#d1ecf1' : '#f8d7da'}; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusEmoji} Ενημέρωση Αιτήματος Άδειας</h1>
          </div>
          <div class="content">
            <p>Αγαπητέ/ή <strong>${employeeName}</strong>,</p>
            
            <div class="status-badge">
              ${statusEmoji} Το αίτημά σας ${statusText}
            </div>
            
            <p>Το αίτημα άδειάς σας έχει εξεταστεί και ${isApproved ? 'εγκρίθηκε' : 'απορρίφθηκε'}.</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">📅 Περίοδος Άδειας:</span>
                <span class="value">${new Date(startDate).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="label">⏱️ Διάρκεια:</span>
                <span class="value">${Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} ημέρες</span>
              </div>
              <div class="detail-row">
                <span class="label">👨‍💼 Εξέτασε:</span>
                <span class="value">${reviewerName}</span>
              </div>
              <div class="detail-row">
                <span class="label">📅 Ημερομηνία Εξέτασης:</span>
                <span class="value">${new Date(reviewDate).toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            <div class="reason-box">
              <strong>💭 Αρχική Αιτιολογία:</strong><br><br>
              ${reason}
            </div>
            
            ${isApproved ? `
            <div class="next-steps">
              <h3>✅ Επόμενα Βήματα:</h3>
              <ul>
                <li>Η άδειά σας έχει εγκριθεί για τις παραπάνω ημερομηνίες</li>
                <li>Παρακαλώ ενημερώστε τους συναδέλφους σας για την απουσία σας</li>
                <li>Φροντίστε να παραδώσετε τις εκκρεμότητές σας πριν την αναχώρηση</li>
                <li>Καλή διασκέδαση! 🌴</li>
              </ul>
            </div>
            ` : `
            <div class="next-steps">
              <h3>❌ Πληροφορίες:</h3>
              <ul>
                <li>Το αίτημά σας δεν μπόρεσε να εγκριθεί αυτή τη στιγμή</li>
                <li>Μπορείτε να επικοινωνήσετε με τον/την ${reviewerName} για περισσότερες πληροφορίες</li>
                <li>Είστε ευπρόσδεκτος να υποβάλετε νέο αίτημα για άλλες ημερομηνίες</li>
              </ul>
            </div>
            `}
            
          </div>
          <div class="footer">
            <p>Αυτό το email στάλθηκε αυτόματα από το Σύστημα Διαχείρισης Αδειών.<br>
            Για περισσότερες πληροφορίες επικοινωνήστε με τον άμεσο προϊστάμενό σας.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Σύστημα Αδειών" <${process.env.EMAIL_USER}>`,
      to: employeeEmail,
      subject: subject,
      html: htmlContent
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Vacation decision notification sent to employee: ${employeeEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to send vacation decision notification:', error);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready to send emails');
      return { success: true };
    } catch (error) {
      console.error('Email service connection failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
*/
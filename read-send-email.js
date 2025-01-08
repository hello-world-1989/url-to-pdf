import * as nodemailer from 'nodemailer';
import * as imaps from 'imap-simple';

import { keywordToPDF } from './url-to-pdf.js';

const from = process.env.FROM;
const APP_PASSWORD = process.env.APP_PASSWORD;

async function sendEmail(to, subject, body, attachmentBuffer) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: from,
      pass: APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: body,
    attachments: [
      // {
      //   filename: 'result.pdf', // Name of the file in the email
      //   path: './path/to/example.txt', // Path to the file
      // },
      {
        filename: 'result.pdf',
        content: attachmentBuffer, // Send content as a Buffer (optional)
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function readEmailAndMarkAsRead() {
  const config = {
    imap: {
      user: from,
      password: APP_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false, // Bypass self-signed certificate error
      },
      authTimeout: 3000,
    },
  };

  try {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX'); // Open the INBOX folder ?? and spam

    // Search criteria for unread emails
    const searchCriteria = ['UNSEEN'];

    // Fetch messages
    const messages = await connection.search(searchCriteria, {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false,
    });

    if (messages.length === 0) {
      console.log('No unread emails to mark as read.');
      connection.end();
      return;
    }

    console.log('message length: ', messages.length);

    // const [ip, ss] = await getSS();

    for (const message of messages) {
      const header = message?.parts?.find((part) => part.which === 'HEADER');
      const body = message?.parts?.find((part) => part.which === 'TEXT')?.body;

      const subject = header?.body?.subject?.[0] ?? '(No Subject)';
      const senderEmail = header?.body?.from?.[0]; //

      console.log('From:', senderEmail);
      console.log('Subject:', subject);

      if (
        subject?.includes('搜索') ||
        subject?.startsWith('http://') ||
        subject?.startsWith('https://') ||
        subject?.startsWith('www.') ||
        subject?.toLowerCase()?.includes('search') ||
        body.includes('搜索') ||
        body?.toLowerCase()?.includes('search')
      ) {
        const keyword = subject
          ?.toLowerCase()
          .replace('搜索', '')
          .replace('search', '');

        const pdfBuffer = await keywordToPDF(keyword);

        await sendEmail(
          senderEmail,
          'RE: Search Result',
          `Search Result`,
          pdfBuffer
        );
      }
      // Mark messages as read
      const uid = message?.attributes?.uid;
      await connection.addFlags(uid, '\\Seen'); // Add the "Seen" flag
    }

    console.log(`Marked email as read.`);
    connection.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

readEmailAndMarkAsRead();

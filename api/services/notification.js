import { BrevoClient } from '@getbrevo/brevo';

const getClient = () => {
  return new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
};

export const sendStatusEmail = async ({ to, monitor, project, status }) => {
  try {
    const client = getClient();
    const isUp = status === 'UP';
    const subject = isUp
      ? `Monitor ${monitor} for project ${project} is back up!`
      : `Monitor ${monitor} for project ${project} is down!`;
    const htmlContent = `<h1>${isUp ? 'UP' : 'DOWN'}</h1>`;

    await client.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent,
      sender: {
        name: process.env.EMAIL_FROM || 'Mini Data Dog',
        email: process.env.EMAIL_FROM_ADDRESS,
      },
      to: [{ email: to }]
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
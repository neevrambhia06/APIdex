import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: 'Welcome to APIdex!',
    html: `<h1>Welcome, ${name}!</h1><p>You've successfully joined the API Universe Explorer.</p>`,
  });
}

export async function sendSubmissionEmail(email: string, status: 'approved' | 'rejected', note?: string) {
  const subject = status === 'approved' ? 'Your API has been listed!' : 'Update on your API submission';
  const body = status === 'approved' 
    ? 'Congratulations! Your API is now live on APIdex.' 
    : `Your submission was not approved. Note: ${note || 'No additional feedback provided.'}`;

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject,
    html: `<p>${body}</p>`,
  });
}

import { Resend } from 'resend'

export interface ContactEmailInput {
  name: string
  email: string
  message: string
}

export async function sendContactEmail({ name, email, message }: ContactEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL

  if (!apiKey || !contactEmail) {
    throw new Error('email-not-configured')
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: 'Surgery4all <onboarding@resend.dev>',
    to: contactEmail,
    replyTo: email,
    subject: 'Nouveau message — Surgery4all',
    text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  })

  if (error) {
    throw new Error('send-failed')
  }
}

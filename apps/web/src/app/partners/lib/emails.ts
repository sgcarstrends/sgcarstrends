// TODO: Revisit email templates - consider using React Email for better design
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

const FROM_EMAIL = "SG Cars Trends <noreply@sgcarstrends.com>";

export async function sendMagicLinkEmail(email: string, url: string) {
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Sign in to SG Cars Trends Partner Dashboard",
    html: `
      <h2>Sign in to your Partner Dashboard</h2>
      <p>Click the link below to sign in to your SG Cars Trends Partner Dashboard:</p>
      <p><a href="${url}">Sign in to Partner Dashboard</a></p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this email, you can safely ignore it.</p>
    `,
  });

  if (error) {
    console.error("Failed to send magic link email:", error.message);
    throw new Error(`Failed to send magic link email: ${error.message}`);
  }
}

export async function sendCampaignStatusEmail(
  email: string,
  campaignName: string,
  status: "active" | "paused" | "ended",
) {
  const statusMessages = {
    active: "Your campaign is now live and serving ads.",
    paused: "Your campaign has been paused.",
    ended: "Your campaign has ended.",
  };

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Campaign "${campaignName}" - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    html: `
      <h2>Campaign Status Update</h2>
      <p>Your campaign <strong>"${campaignName}"</strong> status has changed.</p>
      <p>${statusMessages[status]}</p>
      <p><a href="https://partners.sgcarstrends.com/campaigns">View your campaigns</a></p>
    `,
  });

  if (error) {
    console.error("Failed to send campaign status email:", error.message);
    throw new Error(`Failed to send campaign status email: ${error.message}`);
  }
}

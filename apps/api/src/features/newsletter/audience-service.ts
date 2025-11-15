import { NEWSLETTER_FROM_EMAIL } from "@api/config/resend";
import type { NewsletterContent } from "@api/features/newsletter/models";

const createNewsletterSubject = (date: Date) => {
  const month = date.toISOString().slice(0, 7);
  return {
    month,
    subject: `Monthly Newsletter ${month}`,
  };
};

export const createMonthlyNewsletterContent = (
  currentDate: Date = new Date(),
): NewsletterContent => {
  const { month, subject } = createNewsletterSubject(currentDate);

  const text = `${subject}

---
You're receiving this because you subscribed to SG Cars Trends newsletter.
Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}
`.trim();

  return {
    name: `Monthly Newsletter ${month}`,
    subject,
    text,
    month,
  };
};

export const getNewsletterSender = () => NEWSLETTER_FROM_EMAIL;

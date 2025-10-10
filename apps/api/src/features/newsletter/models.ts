export interface NewsletterContent {
  name: string;
  subject: string;
  text: string;
  month: string;
}

export interface NewsletterSubscriptionResult {
  success: boolean;
  message: string;
}

export class NewsletterConfigError extends Error {
  constructor(message = "Newsletter configuration missing") {
    super(message);
    this.name = "NewsletterConfigError";
  }
}

export class NewsletterAlreadySubscribedError extends Error {
  constructor(message = "Email already subscribed") {
    super(message);
    this.name = "NewsletterAlreadySubscribedError";
  }
}

export class NewsletterSubscriptionError extends Error {
  constructor(message = "Failed to subscribe to newsletter") {
    super(message);
    this.name = "NewsletterSubscriptionError";
  }
}

export class NewsletterBroadcastError extends Error {
  constructor(message = "Failed to process newsletter broadcast") {
    super(message);
    this.name = "NewsletterBroadcastError";
  }
}

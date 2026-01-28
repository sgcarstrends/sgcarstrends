---
name: social-media
description: Add or update social media posting integrations (Discord, LinkedIn, Telegram, Twitter) in workflows. Use when adding new platforms, debugging posting failures, modifying message templates, or configuring webhook URLs.
allowed-tools: Read, Edit, Grep, Glob
---

# Social Media Integration Skill

Integrations live in `apps/web/src/lib/workflows/social/`.

**Supported Platforms:** Discord (webhook), LinkedIn (OAuth), Telegram (Bot API), Twitter (API v2)

## Integration Patterns

### Telegram

```typescript
export async function postToTelegram(message: string) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  });
}
```

### Twitter

```typescript
export async function postToTwitter(message: string) {
  await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: message }),
  });
}
```

### LinkedIn

```typescript
export async function postToLinkedIn(message: string) {
  await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: `urn:li:organization:${process.env.LINKEDIN_ORG_ID}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: message },
          shareMediaCategory: "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });
}
```

## Message Templates

```typescript
export function createCarDataMessage(data: CarRegistrationData) {
  return `🚗 Car Registration Update - ${data.month} ${data.year}

📊 Total Registrations: ${data.total.toLocaleString()}
🏆 Top Makes: ${data.topMakes.slice(0, 3).join(", ")}

📈 View: https://sgcarstrends.com/data/${data.year}/${data.month}

#SingaporeCars #CarRegistration`;
}
```

## Character Limits

| Platform | Limit |
|----------|-------|
| Twitter | 280 |
| LinkedIn | 3,000 |
| Telegram | 4,096 |
| Discord | 2,000 (message), 6,000 (embed) |

## Environment Variables

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
TWITTER_BEARER_TOKEN=...
LINKEDIN_ACCESS_TOKEN=...
LINKEDIN_ORG_ID=...
```

## Error Handling

```typescript
export async function postToAllPlatforms(message: string) {
  const results = await Promise.allSettled([
    postToTelegram(message),
    postToTwitter(message),
    postToLinkedIn(message),
  ]);
  const failures = results.filter(r => r.status === "rejected");
  if (failures.length > 0) console.error("Posting failures:", failures);
}
```

## Debugging

1. **Auth errors**: Verify env vars, check token expiration
2. **Rate limits**: Implement retry with backoff
3. **Format issues**: Check char limits, test markdown support

## Best Practices

1. **Error Handling**: Handle API failures gracefully
2. **Rate Limiting**: Implement limits to avoid bans
3. **Testing**: Test on dev/sandbox accounts first
4. **Credentials**: Never commit tokens

## References

- `apps/web/CLAUDE.md` for workflow integration details

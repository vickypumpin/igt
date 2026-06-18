import nodemailer from "nodemailer";
import { db, settingsTable } from "@workspace/db";

async function getSettings() {
  const [s] = await db.select().from(settingsTable).limit(1);
  return s ?? null;
}

export async function sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
  const s = await getSettings();
  if (!s?.smtpHost || !s?.smtpUser || !s?.smtpPassword) {
    console.warn("[notify] SMTP not configured — skipping email to", to);
    return;
  }
  const siteName = s.siteName ?? "iGoTrend";
  const fromEmail = s.smtpFromEmail ?? s.smtpUser;
  const transporter = nodemailer.createTransport({
    host: s.smtpHost,
    port: s.smtpPort ?? 587,
    secure: (s.smtpPort ?? 587) === 465,
    auth: { user: s.smtpUser, pass: s.smtpPassword },
  });
  await transporter.sendMail({
    from: `"${siteName}" <${fromEmail}>`,
    to,
    subject,
    html: htmlBody,
  });
}

export async function sendSms(to: string, message: string): Promise<void> {
  const s = await getSettings();
  if (!s?.smsNotify) {
    return;
  }
  if (!s?.smsLive247ApiKey) {
    console.warn("[notify] SMSLive247 API key not configured — skipping SMS to", to);
    return;
  }
  const sender = s.smsLive247SenderName ?? s.siteName ?? "iGoTrend";
  const body = JSON.stringify({
    api_key: s.smsLive247ApiKey,
    message_type: "0",
    to,
    from: sender,
    channel: s.smsLive247AccountType ?? "Classic",
    pin_attempts: 10,
    pin_time_to_live: 5,
    pin_length: 6,
    pin_placeholder: "< 1234 >",
    message_text: message,
    pin_type: "NUMERIC",
  });
  const resp = await fetch("https://api.smslive247.com/v5/sms", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body,
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    console.warn("[notify] SMSLive247 error:", resp.status, text);
  }
}

// ── Test-send variants (throw on missing config; bypass smsNotify toggle) ─────

export async function sendTestEmail(to: string, subject: string, htmlBody: string): Promise<void> {
  const s = await getSettings();
  if (!s?.smtpHost) throw new Error("SMTP host is not configured");
  if (!s?.smtpUser) throw new Error("SMTP username is not configured");
  if (!s?.smtpPassword) throw new Error("SMTP password is not configured");
  const siteName = s.siteName ?? "iGoTrend";
  const fromEmail = s.smtpFromEmail ?? s.smtpUser;
  const transporter = nodemailer.createTransport({
    host: s.smtpHost,
    port: s.smtpPort ?? 587,
    secure: (s.smtpPort ?? 587) === 465,
    auth: { user: s.smtpUser, pass: s.smtpPassword },
  });
  await transporter.sendMail({
    from: `"${siteName}" <${fromEmail}>`,
    to,
    subject,
    html: htmlBody,
  });
}

export async function sendTestSms(to: string, message: string): Promise<void> {
  const s = await getSettings();
  if (!s?.smsLive247ApiKey) throw new Error("SMSLive247 API key is not configured");
  const sender = s.smsLive247SenderName ?? s.siteName ?? "iGoTrend";
  const body = JSON.stringify({
    api_key: s.smsLive247ApiKey,
    message_type: "0",
    to,
    from: sender,
    channel: s.smsLive247AccountType ?? "Classic",
    pin_attempts: 10,
    pin_time_to_live: 5,
    pin_length: 6,
    pin_placeholder: "< 1234 >",
    message_text: message,
    pin_type: "NUMERIC",
  });
  const resp = await fetch("https://api.smslive247.com/v5/sms", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body,
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`SMSLive247 error ${resp.status}: ${text}`);
  }
}

const BRAND_COLOR = "#FF8C42";

function emailWrapper(siteName: string, content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,${BRAND_COLOR},#E47128);padding:24px 32px;">
          <span style="color:#fff;font-size:22px;font-weight:bold;">${siteName}</span>
        </td></tr>
        <tr><td style="padding:32px;">${content}</td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #eee;text-align:center;">
          <span style="color:#aaa;font-size:12px;">&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(href: string, label: string): string {
  return `<p style="margin:24px 0 0;"><a href="${href}" style="display:inline-block;background:linear-gradient(135deg,${BRAND_COLOR},#E47128);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;font-size:14px;">${label}</a></p>`;
}

function p(text: string): string {
  return `<p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;">${text}</p>`;
}

function h2(text: string): string {
  return `<h2 style="color:#1a1a1a;font-size:20px;margin:0 0 16px;">${text}</h2>`;
}

// ── Email template builders ────────────────────────────────────────────────

export function tplWelcome(siteName: string, firstName: string, dashboardUrl: string): string {
  return emailWrapper(siteName, `
    ${h2(`Welcome to ${siteName}, ${firstName}!`)}
    ${p(`Your account has been created successfully. You're ready to get started.`)}
    ${btn(dashboardUrl, "Go to Dashboard")}
  `);
}

export function tplCampaignInvite(siteName: string, creatorName: string, campaignName: string, brand: string, invitesUrl: string): string {
  return emailWrapper(siteName, `
    ${h2(`You've been invited to a campaign`)}
    ${p(`Hi ${creatorName},`)}
    ${p(`<strong>${brand}</strong> has invited you to join the campaign <strong>"${campaignName}"</strong>.`)}
    ${p(`Log in to view the details and accept or decline the invitation.`)}
    ${btn(invitesUrl, "View Invitation")}
  `);
}

export function tplInviteResponse(siteName: string, brandName: string, creatorName: string, campaignName: string, accepted: boolean, dashboardUrl: string): string {
  const action = accepted ? "accepted" : "declined";
  return emailWrapper(siteName, `
    ${h2(`Invite ${accepted ? "Accepted" : "Declined"}`)}
    ${p(`Hi ${brandName},`)}
    ${p(`<strong>${creatorName}</strong> has <strong>${action}</strong> your invitation to join <strong>"${campaignName}"</strong>.`)}
    ${btn(dashboardUrl, "View Campaign")}
  `);
}

export function tplCampaignApproved(siteName: string, brandName: string, campaignName: string, dashboardUrl: string): string {
  return emailWrapper(siteName, `
    ${h2(`Campaign Approved!`)}
    ${p(`Hi ${brandName},`)}
    ${p(`Great news! Your campaign <strong>"${campaignName}"</strong> has been reviewed and approved by the ${siteName} team.`)}
    ${p(`You can now invite creators and start receiving submissions.`)}
    ${btn(dashboardUrl, "Manage Campaign")}
  `);
}

export function tplCampaignRejected(siteName: string, brandName: string, campaignName: string, dashboardUrl: string): string {
  return emailWrapper(siteName, `
    ${h2(`Campaign Not Approved`)}
    ${p(`Hi ${brandName},`)}
    ${p(`Unfortunately, your campaign <strong>"${campaignName}"</strong> was not approved at this time.`)}
    ${p(`Please review your campaign details and resubmit, or contact support for more information.`)}
    ${btn(dashboardUrl, "View Campaign")}
  `);
}

export function tplSubmissionReceived(siteName: string, brandName: string, campaignName: string, dashboardUrl: string): string {
  return emailWrapper(siteName, `
    ${h2(`New Submission Received`)}
    ${p(`Hi ${brandName},`)}
    ${p(`A creator has submitted content for your campaign <strong>"${campaignName}"</strong>.`)}
    ${p(`Log in to review and approve or reject the submission.`)}
    ${btn(dashboardUrl, "Review Submission")}
  `);
}

export function tplSubmissionApproved(siteName: string, creatorName: string, campaignName: string, dashboardUrl: string): string {
  return emailWrapper(siteName, `
    ${h2(`Submission Approved!`)}
    ${p(`Hi ${creatorName},`)}
    ${p(`Your submission for the campaign <strong>"${campaignName}"</strong> has been approved!`)}
    ${p(`You are now eligible to request a payout for this campaign.`)}
    ${btn(dashboardUrl, "View Dashboard")}
  `);
}

export function tplSubmissionRejected(siteName: string, creatorName: string, campaignName: string, dashboardUrl: string): string {
  return emailWrapper(siteName, `
    ${h2(`Submission Not Approved`)}
    ${p(`Hi ${creatorName},`)}
    ${p(`Your submission for the campaign <strong>"${campaignName}"</strong> was not approved.`)}
    ${p(`Please review the campaign requirements and resubmit if eligible.`)}
    ${btn(dashboardUrl, "View Campaign")}
  `);
}

export function tplPayoutDisbursed(siteName: string, creatorName: string, amount: string, dashboardUrl: string): string {
  return emailWrapper(siteName, `
    ${h2(`Payout Disbursed!`)}
    ${p(`Hi ${creatorName},`)}
    ${p(`Your payout of <strong>${amount}</strong> has been disbursed to your registered bank account.`)}
    ${p(`Please allow 1–3 business days for the funds to reflect, depending on your bank.`)}
    ${btn(dashboardUrl, "View Payouts")}
  `);
}

export function tplNewMessage(siteName: string, recipientName: string, senderName: string, dashboardUrl: string): string {
  return emailWrapper(siteName, `
    ${h2(`You have an unread message`)}
    ${p(`Hi ${recipientName},`)}
    ${p(`<strong>${senderName}</strong> sent you a message on ${siteName} that you haven't read yet.`)}
    ${btn(dashboardUrl, "Read Message")}
  `);
}

export function tplTest(siteName: string): string {
  return emailWrapper(siteName, `
    ${h2("Test Email")}
    ${p(`This is a test email from <strong>${siteName}</strong>.`)}
    ${p("If you received this, your SMTP configuration is working correctly.")}
  `);
}

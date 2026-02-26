import { Resend } from "resend";

/**
 * send a notification email when an admin approves a job submission.
 * uses the same resend setup as the magic link auth flow.
 */
export async function sendApprovalNotification({
  to,
  jobTitle,
  company,
}: {
  to: string;
  jobTitle: string;
  company: string;
}): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("[email] RESEND_API_KEY not set");
    return false;
  }

  const resend = new Resend(resendApiKey);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "echo <echo@worldglide.careers>";
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://worldglide.careers";

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `your job is live on worldglide`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 0; text-align: center;">
          <p style="font-size: 10px; font-family: monospace; color: #999; margin-bottom: 24px; letter-spacing: 0.05em;">
            echo ･ worldglide
          </p>
          <p style="font-size: 14px; color: #333; margin-bottom: 8px;">
            <strong>${jobTitle}</strong> at <strong>${company}</strong> is now live.
          </p>
          <p style="font-size: 12px; color: #666; margin-bottom: 24px;">
            your listing has been reviewed & approved. it's now visible to candidates browsing worldglide.
          </p>
          <a href="${siteUrl}"
             style="display: inline-block; background: #000; color: #fff; padding: 12px 24px;
                    text-decoration: none; font-size: 11px; font-family: monospace;">
            view on worldglide
          </a>
          <p style="font-size: 10px; color: #999; margin-top: 24px;">
            worldglide ･ jobs without borders
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[email] resend error:", JSON.stringify(error));
      return false;
    }

    return true;
  } catch (err) {
    console.error("[email] failed to send:", err);
    return false;
  }
}

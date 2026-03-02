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
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="400" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="font-size: 10px; font-family: 'Courier New', monospace; color: #999; padding-bottom: 24px; letter-spacing: 0.05em;">
                    echo &middot; worldglide
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 14px; color: #333; padding-bottom: 8px;">
                    <strong>${jobTitle}</strong> at <strong>${company}</strong> is now live.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 12px; color: #666; padding-bottom: 24px;">
                    your listing has been reviewed &amp; approved. it's now visible to candidates browsing worldglide.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <a href="${siteUrl}"
                       style="display: inline-block; background: #000; color: #fff; padding: 12px 24px;
                              text-decoration: none; font-size: 11px; font-family: 'Courier New', monospace;">
                      view on worldglide
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 10px; color: #999;">
                    worldglide &middot; careers without borders
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
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

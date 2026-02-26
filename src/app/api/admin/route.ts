import { NextResponse } from "next/server";
import {
  approveSubmission,
  rejectSubmission,
  resurrectSubmission,
  deleteSubmission,
  getSubmissions,
} from "@/lib/storage";
import { sendApprovalNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: "Missing id or action" },
        { status: 400 },
      );
    }

    if (action === "approve") {
      // fetch submission before approving so we have the contact email
      const submissions = await getSubmissions();
      const submission = submissions.find((s) => s.id === id);

      const success = await approveSubmission(id);
      if (!success) {
        return NextResponse.json(
          { error: "Submission not found" },
          { status: 404 },
        );
      }

      // fire notification email (non-blocking → don't fail the approval if email fails)
      if (submission?.contactEmail) {
        sendApprovalNotification({
          to: submission.contactEmail,
          jobTitle: submission.title,
          company: submission.company,
        }).catch((err) =>
          console.error("[admin] failed to send approval email:", err),
        );
      }

      return NextResponse.json({ success: true });
    }

    if (action === "reject") {
      await rejectSubmission(id);
      return NextResponse.json({ success: true });
    }

    if (action === "resurrect") {
      await resurrectSubmission(id);
      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      await deleteSubmission(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Admin action error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

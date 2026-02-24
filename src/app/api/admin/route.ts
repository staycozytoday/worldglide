import { NextResponse } from "next/server";
import { approveSubmission, rejectSubmission } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: "Missing id or action" },
        { status: 400 }
      );
    }

    // Protected by middleware (HTTP Basic Auth) — see src/middleware.ts

    if (action === "approve") {
      const success = await approveSubmission(id);
      if (!success) {
        return NextResponse.json(
          { error: "Submission not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    }

    if (action === "reject") {
      await rejectSubmission(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Admin action error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

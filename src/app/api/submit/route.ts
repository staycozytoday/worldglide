import { NextResponse } from "next/server";
import { saveSubmission } from "@/lib/storage";
import { JobSubmission, Category } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ["title", "company", "category", "url", "contactEmail"];
    for (const field of required) {
      if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate category
    const validCategories: Category[] = ["engineering", "product", "design"];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(body.url);
    } catch {
      return NextResponse.json(
        { error: "Invalid job posting URL" },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.contactEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Sanitize: strip HTML tags
    const sanitize = (str: string) =>
      str.replace(/<[^>]*>/g, "").trim();

    // Create submission
    const submission: JobSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: sanitize(body.title),
      company: sanitize(body.company),
      category: body.category as Category,
      url: body.url.trim(),
      contactEmail: sanitize(body.contactEmail),
      submittedAt: new Date().toISOString(),
      approved: false,
    };

    await saveSubmission(submission);

    return NextResponse.json({ success: true, id: submission.id });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "couldn't save right now — please try again later" },
      { status: 500 }
    );
  }
}

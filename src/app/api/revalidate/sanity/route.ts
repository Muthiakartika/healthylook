import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

type WebhookBody = {
  _type?: string;
  slug?: string;
  path?: string;
};

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: WebhookBody = {};
  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    // A global invalidation still works for webhooks without a projection.
  }

  revalidateTag("sanity");
  if (body._type === "page") {
    revalidateTag("sanity:page");
    if (body.path) revalidateTag(`sanity:page:${body.path}`);
  }
  if (body._type === "post") {
    revalidateTag("sanity:post");
    if (body.slug) revalidateTag(`sanity:post:${body.slug}`);
  }

  return NextResponse.json({ ok: true, revalidated: body });
}

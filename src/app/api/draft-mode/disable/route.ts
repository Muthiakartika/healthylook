import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  (await draftMode()).disable();
  const requestUrl = new URL(request.url);
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/";
  const safePath = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
  return NextResponse.redirect(new URL(safePath, requestUrl.origin));
}

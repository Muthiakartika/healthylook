"use client";

import { useTransition } from "react";
import { signOut } from "./actions";

export default function SignOutButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => void signOut())}
      className="font-sans text-caption uppercase tracking-caps text-muted transition-colors hover:text-primary disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

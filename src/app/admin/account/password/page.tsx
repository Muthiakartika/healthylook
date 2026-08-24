import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import PasswordForm from "./PasswordForm";

/**
 * Change your own password.
 *
 * Sits OUTSIDE the (dash) route group on purpose. The dashboard guard
 * sends anyone with `must_change_password` here, so this page cannot be
 * behind that same guard without redirecting to itself forever. It does
 * its own, narrower check: signed in, nothing more.
 */
export default async function PasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const forced = user.must_change_password;

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-gutter py-16">
      <div className="w-full max-w-sm">
        <h1 className="font-script text-h2 leading-heading text-primary">
          {forced ? "Choose your password" : "Change your password"}
        </h1>

        <p className="mt-4 font-sans text-label leading-relaxed text-text-secondary">
          {forced
            ? "You were given a temporary password. Pick your own before you carry on — the temporary one stops working straight away."
            : `Signed in as ${user.email}.`}
        </p>

        <div className="mt-10">
          <PasswordForm forced={forced} />
        </div>
      </div>
    </main>
  );
}

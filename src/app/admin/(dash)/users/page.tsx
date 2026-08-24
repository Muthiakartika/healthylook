import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { getCurrentUser, type User } from "@/lib/auth";
import InviteForm from "./InviteForm";
import UserRow from "./UserRow";

export const metadata = { title: "Team" };

export default async function UsersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");
  // Editors have no business seeing the team list, let alone the controls
  // on it. The layout lets them reach the URL; this is what stops them.
  if (me.role !== "admin") redirect("/admin");

  const users = await query<User & { created_by_name: string | null }>(
    `SELECT u.id, u.email, u.name, u.role, u.must_change_password,
            u.disabled_at, u.created_at, u.last_login_at,
            c.name AS created_by_name
       FROM users u
       LEFT JOIN users c ON c.id = u.created_by
      ORDER BY u.disabled_at NULLS FIRST, u.created_at`,
  );

  return (
    <>
      <h1 className="font-script text-h2 leading-heading text-primary">Team</h1>
      <p className="mt-4 measure font-sans text-copy leading-body text-text-secondary">
        Editors can change every page, treatment and article. Admins can do that
        and manage this list. Nobody but an admin can see this page.
      </p>

      <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="font-sans text-h4 text-ink">People with access</h2>

          <ul className="mt-6 flex flex-col divide-y divide-hairline border-y border-hairline">
            {users.map((user) => (
              <UserRow key={user.id} user={user} isSelf={user.id === me.id} />
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-hairline bg-paper p-7">
            <h2 className="font-sans text-h4 text-ink">Add someone</h2>
            <p className="mt-3 font-sans text-label leading-relaxed text-text-secondary">
              They get a temporary password, shown once on this screen. Pass it
              to them yourself — the dashboard never emails it, and never stores
              it in a form it can read back.
            </p>
            <div className="mt-7">
              <InviteForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

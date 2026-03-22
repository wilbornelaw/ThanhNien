import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

export function AdminHeader({
  title,
  description,
  profile,
}: {
  title: string;
  description: string;
  profile: Profile;
}) {
  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-border/70 bg-card p-6 shadow-editorial lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-black">{title}</h1>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{profile.full_name || profile.email}</p>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{profile.role}</p>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}


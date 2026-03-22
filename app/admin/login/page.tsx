"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile || !["admin", "editor"].includes(profile.role)) {
        await supabase.auth.signOut();
        return;
      }

      router.replace(searchParams.get("redirectTo") || "/admin");
      router.refresh();
    })();
  }, [router, searchParams]);

  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
            Admin Access
          </p>
          <CardTitle className="text-3xl">Sign in to the publishing desk</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const email = String(formData.get("email") || "");
              const password = String(formData.get("password") || "");

              startTransition(async () => {
                const supabase = createSupabaseBrowserClient();
                const { error: authError, data } = await supabase.auth.signInWithPassword({
                  email,
                  password,
                });

                if (authError) {
                  setError(authError.message);
                  return;
                }

                const { data: profile } = await supabase
                  .from("profiles")
                  .select("role")
                  .eq("id", data.user.id)
                  .maybeSingle();

                if (!profile || !["admin", "editor"].includes(profile.role)) {
                  await supabase.auth.signOut();
                  setError("This account does not have admin dashboard access.");
                  return;
                }

                router.push(searchParams.get("redirectTo") || "/admin");
                router.refresh();
              });
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="container-shell min-h-screen bg-background" />}>
      <AdminLoginContent />
    </Suspense>
  );
}

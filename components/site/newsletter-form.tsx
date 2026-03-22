"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "");

        startTransition(async () => {
          const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            const data = await response.json();
            setMessage(data.error || "Subscription failed.");
            return;
          }

          setMessage("Subscription confirmed. Daily briefings will arrive in your inbox.");
          event.currentTarget.reset();
        });
      }}
    >
      <Input
        name="email"
        type="email"
        placeholder="Enter your email address"
        required
        className="h-12 border-foreground/15"
      />
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Submitting..." : "Subscribe"}
      </Button>
      {message ? <p className="text-sm text-muted-foreground sm:col-span-2">{message}</p> : null}
    </form>
  );
}

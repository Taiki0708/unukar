"use client";
import { useState, type FormEvent } from "react";
export function SignupForm() {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error" | "unconfigured"
  >("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    const endpoint = process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT;
    if (!endpoint) {
      setStatus("unconfigured");
      return;
    }
    setStatus("pending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("Signup failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }
  return (
    <form onSubmit={submit} className="signup-form">
      <label htmlFor="email">Your email address</label>
      <div className="signup-row">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@somewhere.com"
          required
          maxLength={254}
          disabled={status === "pending"}
          aria-describedby="signup-note signup-status"
        />
        <button type="submit" disabled={status === "pending"}>
          {status === "pending" ? "JOINING…" : "COUNT ME IN"}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p id="signup-note" className="form-note">
        Early access and occasional letters from UNUKAR. Unsubscribe anytime.
      </p>
      <p
        id="signup-status"
        className="form-status"
        role="status"
        aria-live="polite"
      >
        {status === "success"
          ? "You’re on the list. We’ll be in touch when your next chapter is ready."
          : status === "error"
            ? "We couldn’t submit your email. Please try again in a moment."
            : status === "unconfigured"
              ? "Signups aren’t open yet. Your email hasn’t been saved. Please check back soon."
              : ""}
      </p>
    </form>
  );
}

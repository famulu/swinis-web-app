"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push("/manage");
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      {error && <div className="bg-red-500 p-2 text-white">{error}</div>}
      <form
        className="flex w-full flex-col items-center gap-2"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-72 rounded-md border border-black p-1"
        />
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-72 rounded-md border border-black p-1"
        />
        <button
          type="submit"
          disabled={submitting}
          className={`w-fit rounded-md border border-black p-2 ${submitting ? "bg-gray-300" : "bg-gray-100"}`}
        >
          Login
        </button>
      </form>
    </div>
  );
}

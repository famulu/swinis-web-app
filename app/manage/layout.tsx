"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const [isValidUser, setIsValidUser] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsValidUser(true);
      }
    });
  }, [router]);

  return isValidUser ? children : <p>Loading...</p>;
}

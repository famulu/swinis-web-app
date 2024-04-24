"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { app } from "@/lib/firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";

export default function Page() {
  const [isValidUser, setIsValidUser] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsValidUser(true);
      }
    });
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fileInputRef.current === null) return;

    const files = fileInputRef.current.files;
    if (files === null || files.length === 0) return;

    const imageFile = files[0];
    const storage = getStorage(app);
    const eventImageRef = ref(storage, imageFile.name);
    const snapshot = await uploadBytes(eventImageRef, imageFile);
    const url = await getDownloadURL(snapshot.ref);

    const db = getFirestore(app);
    const timestamp = Date.parse(`${date}T${time}`);
    await setDoc(doc(db, "events", "eventData"), { imageUrl: url, timestamp });
  }

  return isValidUser ? (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-screen flex-col items-center justify-center border border-black"
    >
      <label>
        {" "}
        Event Image{" "}
        <input type="file" accept="image/*" ref={fileInputRef} required />
      </label>
      <label>
        Date{" "}
        <input
          type="date"
          value={date}
          required
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label>
        Time{" "}
        <input
          type="time"
          value={time}
          required
          onChange={(e) => setTime(e.target.value)}
        />
      </label>
      <button className="rounded border border-black p-1">Upload</button>
    </form>
  ) : (
    <div>Loading...</div>
  );
}

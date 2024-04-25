"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { app } from "@/lib/firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Event from "@/components/Event";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const [isValidUser, setIsValidUser] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [timestamp, setTimestamp] = useState(0);
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
    if (fileInputRef.current === null) {
      setAlert("<input type='file' /> is not assigned to ref");
      return;
    }

    const files = fileInputRef.current.files;
    if (files === null || files.length === 0) {
      setAlert("No file selected!");
      return;
    }
    setSubmitting(true);

    const imageFile = files[0];
    const storage = getStorage(app);
    const eventImageRef = ref(storage, imageFile.name);
    const snapshot = await uploadBytes(eventImageRef, imageFile);
    const url = await getDownloadURL(snapshot.ref);

    const db = getFirestore(app);
    const timestamp = Date.parse(`${date}T${time}`);
    await setDoc(doc(db, "events", "eventData"), { imageUrl: url, timestamp });
    setSubmitting(false);
    setAlert("Event uploaded successfully!");
  }

  return isValidUser ? (
    <>
      <Card className="max-w-screen-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Update Homepage Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>
              {" "}
              Event Image{" "}
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                required
                disabled={submitting}
              />
            </Label>
            <Label>
              Date{" "}
              <Input
                type="date"
                value={date}
                required
                onChange={(e) => setDate(e.target.value)}
                disabled={submitting}
              />
            </Label>
            <Label>
              Time{" "}
              <Input
                type="time"
                value={time}
                required
                onChange={(e) => setTime(e.target.value)}
                disabled={submitting}
              />
            </Label>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="font-semibold text-red-500">{alert}</div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={(e) => {
                  if (fileInputRef.current === null) {
                    setAlert("<input type='file' /> is not assigned to ref");
                    return;
                  }

                  const files = fileInputRef.current.files;
                  if (files === null || files.length === 0) {
                    setAlert("No file selected!");
                    return;
                  }

                  if (date === "" || time === "") {
                    setAlert("Date and time are required!");
                    return;
                  }
                  if (imageUrl !== "") {
                    URL.revokeObjectURL(imageUrl);
                  }
                  setImageUrl(URL.createObjectURL(files[0]));
                  setTimestamp(Date.parse(`${date}T${time}`));
                }}
              >
                Preview
              </Button>
              <Button disabled={submitting}>Upload</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
      {imageUrl && <Event timestamp={timestamp} imageUrl={imageUrl} />}
    </>
  ) : (
    <div>Loading...</div>
  );
}

"use client";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FormEvent, useRef, useState } from "react";
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
import revalidate from "@/app/actions";
import { EventData } from "@/lib/db";

export default function Page() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [previewState, setPreviewState] = useState<EventData | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormDataValid()) {
      return;
    }

    const imageFile = getFile();
    if (imageFile === null) {
      return;
    }

    setSubmitting(true);
    const storage = getStorage(app);
    const eventImageRef = ref(storage, imageFile.name);
    const snapshot = await uploadBytes(eventImageRef, imageFile);
    const imageUrl = await getDownloadURL(snapshot.ref);

    const db = getFirestore(app);
    const timestamp = Date.parse(`${date}T${time}`);
    await setDoc(doc(db, "events", "eventData"), {
      imageUrl,
      timestamp,
      eventName,
      eventLink,
    } satisfies EventData);
    revalidate();
    setSubmitting(false);
    setAlert("Event uploaded successfully!");
  }

  function getFile(): File | null {
    if (fileInputRef.current === null) {
      setAlert("<input type='file' /> is not assigned to ref");
      return null;
    }
    const files = fileInputRef.current.files;

    if (files === null || files.length === 0) {
      setAlert("No file selected!");
      return null;
    }
    return files[0];
  }

  function isFormDataValid(): boolean {
    if (eventName === "") {
      setAlert("Event name is required!");
      return false;
    }

    if (eventLink !== "") {
      try {
        new URL(eventLink);
      } catch (e) {
        setAlert(
          "Invalid Link. Link must be a valid URL that starts with http or https. e.g. https://swinis.org",
        );
        return false;
      }
    }

    if (date === "" || time === "") {
      setAlert("Date and time are required!");
      return false;
    }

    return true;
  }

  return (
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
              Name{" "}
              <Input
                type="text"
                value={eventName}
                required
                onChange={(e) => setEventName(e.target.value)}
                disabled={submitting}
              />
            </Label>
            <Label>
              Link{" "}
              <Input
                type="text"
                value={eventLink}
                onChange={(e) => setEventLink(e.target.value)}
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
                  if (!isFormDataValid()) {
                    return;
                  }

                  const imageFile = getFile();
                  if (imageFile === null) {
                    return;
                  }

                  if (previewState && previewState.imageUrl !== "") {
                    URL.revokeObjectURL(previewState.imageUrl);
                  }
                  setAlert("");
                  setPreviewState({
                    imageUrl: URL.createObjectURL(imageFile),
                    timestamp: Date.parse(`${date}T${time}`),
                    eventName,
                    eventLink,
                  });
                }}
              >
                Preview
              </Button>
              <Button disabled={submitting}>Upload</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
      {previewState && (
        <Event
          timestamp={previewState.timestamp}
          imageUrl={previewState.imageUrl}
          eventName={previewState.eventName}
          eventLink={previewState.eventLink}
        />
      )}
    </>
  );
}

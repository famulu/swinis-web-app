"use client";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
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
import revalidate from "@/app/actions";
import { EventData, getEventData } from "@/lib/db";

export default function Page() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [eventDate, setEventDate] = useState("");
  const [eventImageURL, setEventImageURL] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [previewState, setPreviewState] = useState<EventData | null>(null);
  const [uploadNewImage, setUploadNewImage] = useState("false");

  useEffect(() => {
    getEventData().then((data) => {
      setEventName(data.eventName);
      setEventLink(data.eventLink);
      const date = new Date(data.timestamp);
      const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      setEventDate(dateString);
      const timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      setEventTime(timeString);
      setEventImageURL(data.imageURL);
    });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormDataValid()) {
      return;
    }

    let newImageURL;
    if (uploadNewImage === "true") {
      const imageFile = getFile();
      if (imageFile === null) {
        return;
      }

      setSubmitting(true);
      const storage = getStorage(app);
      const eventImageRef = ref(storage, imageFile.name);
      const snapshot = await uploadBytes(eventImageRef, imageFile);
      newImageURL = await getDownloadURL(snapshot.ref);
    } else {
      newImageURL = eventImageURL;
    }

    const db = getFirestore(app);
    const timestamp = Date.parse(`${eventDate}T${eventTime}`);
    await setDoc(doc(db, "events", "eventData"), {
      imageURL: newImageURL,
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

    if (eventDate === "" || eventTime === "") {
      setAlert("Date and time are required!");
      return false;
    }

    return true;
  }

  return (
    <div className="grid min-h-screen place-content-center">
      <Card className="max-w-screen-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Update Homepage Event Details</CardTitle>
          </CardHeader>
          <CardContent className="">
            {eventImageURL && (
              <>
                <div>
                  <Label>
                    <input
                      type="radio"
                      value="false"
                      checked={uploadNewImage === "false"}
                      onChange={(e) => setUploadNewImage(e.target.value)}
                    />{" "}
                    Use existing image
                  </Label>
                </div>
                <div>
                  <Label>
                    <input
                      type="radio"
                      value="true"
                      checked={uploadNewImage === "true"}
                      onChange={(e) => setUploadNewImage(e.target.value)}
                    />{" "}
                    Upload new image
                  </Label>
                </div>
              </>
            )}
            <div className="p-2"></div>
            <Label htmlFor="eventImage">Event Image</Label>
            <Input
              type="file"
              id="eventImage"
              accept="image/*"
              ref={fileInputRef}
              className="w-fit"
              required={uploadNewImage === "true"}
              disabled={submitting || uploadNewImage === "false"}
            />
            <Label htmlFor="eventName">Name</Label>
            <Input
              type="text"
              value={eventName}
              id="eventName"
              required
              className="w-fit"
              onChange={(e) => setEventName(e.target.value)}
              disabled={submitting}
            />
            <Label htmlFor="eventLink">Link</Label>
            <Input
              type="text"
              id="eventLink"
              value={eventLink}
              className="w-fit"
              onChange={(e) => setEventLink(e.target.value)}
              disabled={submitting}
            />
            <Label htmlFor="eventDate">Date</Label>
            <Input
              type="date"
              id="eventDate"
              value={eventDate}
              required
              className="w-fit"
              onChange={(e) => setEventDate(e.target.value)}
              disabled={submitting}
            />
            <Label htmlFor="eventTime">Time</Label>
            <Input
              type="time"
              id="eventTime"
              value={eventTime}
              required
              className="w-fit"
              onChange={(e) => setEventTime(e.target.value)}
              disabled={submitting}
            />
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

                  let imageURL;
                  if (uploadNewImage === "true") {
                    const imageFile = getFile();
                    if (imageFile === null) {
                      return;
                    }

                    if (previewState && previewState.imageURL !== "") {
                      // I'm not sure if this is the right way to revoke the object URL
                      // but it seems to work
                      // previewState.imageUrl can either be a blob URL or a http URL
                      // I'm supposed to call URL.revokeObjectURL() only on the blob URL, but
                      // calling it on the other type doesn't throw an error so I'm just going to call it
                      URL.revokeObjectURL(previewState.imageURL);
                    }
                    imageURL = URL.createObjectURL(imageFile);
                  } else {
                    if (!eventImageURL) {
                      setAlert("No image to preview!");
                      return;
                    } else {
                      imageURL = eventImageURL;
                    }
                  }
                  setAlert("");
                  setPreviewState({
                    imageURL,
                    timestamp: Date.parse(`${eventDate}T${eventTime}`),
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
          imageURL={previewState.imageURL}
          eventName={previewState.eventName}
          eventLink={previewState.eventLink}
        />
      )}
    </div>
  );
}

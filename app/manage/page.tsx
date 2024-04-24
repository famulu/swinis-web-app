import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col p-2">
      <Link href="/manage/prayer" className="p-2 underline hover:no-underline">
        Manage Prayer Schedule
      </Link>
      <Link href="/manage/event" className="p-2 underline hover:no-underline">
        Manage Upcoming Event
      </Link>
    </div>
  );
}

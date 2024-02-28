import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justify-center">
        <Link href="/" className="p-2 hover:bg-gray-200 rounded-md">
          Home
        </Link>
        <Link href="/new" className="p-2 hover:bg-gray-200 rounded-md">
          New
        </Link>
        <Link href="/donate" className="p-2 hover:bg-gray-200 rounded-md">
          Donate
        </Link>
        <Link href="/prayer-times" className="p-2 hover:bg-gray-200 rounded-md">
          Prayer Times
        </Link>
      </div>
    </>
  );
}

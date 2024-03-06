import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justify-center">
        <Link href="/" className="rounded-md p-2 hover:bg-gray-200">
          Home
        </Link>
        <Link href="/new" className="rounded-md p-2 hover:bg-gray-200">
          New
        </Link>
        <Link href="/donate" className="rounded-md p-2 hover:bg-gray-200">
          Donate
        </Link>
        <Link href="/prayer-times" className="rounded-md p-2 hover:bg-gray-200">
          Prayer Times
        </Link>
      </div>
    </>
  );
}

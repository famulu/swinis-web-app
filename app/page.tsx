import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justify-center">
        <Link href="/" className="p-2 hover:bg-gray-200 rounded-md">
          Home
        </Link>
        <Link href="/about" className="p-2 hover:bg-gray-200 rounded-md">
          About
        </Link>
        <Link href="/contact" className="p-2 hover:bg-gray-200 rounded-md">
          Contact
        </Link>
        <Link href="/donate" className="p-2 hover:bg-gray-200 rounded-md">
          Donate
        </Link>
        <Link href="/events" className="p-2 hover:bg-gray-200 rounded-md">
          Events
        </Link>
        <Link href="/programs" className="p-2 hover:bg-gray-200 rounded-md">
          Programs
        </Link>
        <Link href="/prayer-times" className="p-2 hover:bg-gray-200 rounded-md">
          Prayer Times
        </Link>
      </div>
    </>
  );
}

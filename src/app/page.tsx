import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen justify-center items-center bg-white">
      <div className="w-full justify-center border-b border-gray-300 bg-white pb-6 pt-8 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-white lg:p-4">
        <div className="mb-3 ml-1">
          <p className="mb-2 text-gray-800">
            Enter a website URL as the route to get started:
          </p>
          <Link className="block underline text-blue-500 hover:text-blue-700" href="/https://example.com">
            http://localhost:3000/ ← Put the link here
          </Link>
        </div>
      </div>
    </main>
  );
}

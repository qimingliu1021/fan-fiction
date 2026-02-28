import Link from "next/link";

export const metadata = {
  title: "Apply to Be a Tour Guide",
};

export default function ApplyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Become an I Ching Tour Guide</h1>
      <form className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 border rounded"
        />
        {/* …更多字段… */}
        <button
          type="submit"
          className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Submit Application
        </button>
      </form>
      <Link href="/" className="mt-6 text-blue-500 hover:underline">
        ← Back to Home
      </Link>
    </main>
  );
}

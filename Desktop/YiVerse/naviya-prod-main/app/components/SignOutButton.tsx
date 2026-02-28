import { signOut } from "@/lib/auth";
import { useRouter } from "next/router";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/"); // redirect to home page after sign out
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-medium text-gray-500 hover:text-gray-700"
    >
      Sign Out
    </button>
  );
}

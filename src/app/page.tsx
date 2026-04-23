import { AuthScreen } from "@/features/auth";
import { SignUpLoginProvider } from "@/features/auth/context";

export default function Home() {
  return (
    <main className="flex-1 bg-black">
      <SignUpLoginProvider>
        <AuthScreen />
      </SignUpLoginProvider>
    </main>
  );
}

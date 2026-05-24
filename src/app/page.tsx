import { messages } from "@/lib/i18n/messages";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {messages.home.title}
      </h1>
    </main>
  );
}

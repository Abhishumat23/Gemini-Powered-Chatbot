import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-gray-400 to-blue-600 p-6">
      <div className="w-full max-w-2xl bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-6">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
          Gemini Powered ChatBot
        </h1>
        <Chat />
      </div>
    </main>
  );
}

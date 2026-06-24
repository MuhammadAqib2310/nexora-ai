import type { Metadata } from "next";
import { AiCeoChat } from "@/components/ai-ceo/ai-ceo-chat";

export const metadata: Metadata = {
  title: "AI CEO",
};

export default function AiCeoPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI CEO Mode</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Describe a business goal and your AI CEO will analyze your data and
          propose ranked strategies to execute it.
        </p>
      </div>
      <AiCeoChat />
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 mb-6">
          <Sparkles className="h-8 w-8 text-violet-600" />
        </div>
        <h1 className="text-5xl font-black text-gray-900">404</h1>
        <p className="mt-3 text-lg font-medium text-gray-700">Page not found</p>
        <p className="mt-2 text-sm text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

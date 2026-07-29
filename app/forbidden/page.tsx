import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ForbiddenState } from "@/components/ui/error-alert";

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <ForbiddenState
        action={
          <Link href="/">
            <Button>Back to home</Button>
          </Link>
        }
      />
    </div>
  );
}

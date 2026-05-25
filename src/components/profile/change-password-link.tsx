import Link from "next/link";
import { HiChevronRight, HiOutlineLockClosed } from "react-icons/hi2";
import { messages } from "@/lib/i18n/messages";

export function ChangePasswordLink() {
  return (
    <Link
      href="/profile/change-password"
      className="group -mx-5 flex items-center gap-4 border-t border-border px-5 py-5 transition-colors hover:bg-background-muted/50 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <span
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-error text-white"
        aria-hidden>
        <HiOutlineLockClosed className="size-6" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {messages.profile.changePasswordTitle}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-foreground-muted sm:text-sm">
          {messages.profile.changePasswordDescription}
        </span>
      </span>

      <HiChevronRight
        className="size-5 shrink-0 text-foreground-muted transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}

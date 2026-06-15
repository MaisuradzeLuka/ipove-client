import { getCurrentLocale } from "@/lib/i18n/current-locale";
import { getMessages, type Messages } from "@/lib/i18n/get-messages";

function buildApiErrorMap(messages: Messages): Record<string, string> {
  return {
    "Valid email is required":
      getCurrentLocale() === "en"
        ? "A valid email is required"
        : "საჭიროა სწორი ელ. ფოსტა",
    "Password must be at least 8 characters":
      getCurrentLocale() === "en"
        ? "Password must be at least 8 characters"
        : "პაროლი მინიმუმ 8 სიმბოლო უნდა იყოს",
    "Confirm password is required":
      getCurrentLocale() === "en"
        ? "Confirm password is required"
        : "საჭიროა პაროლის დადასტურება",
    "Passwords do not match": messages.auth.passwordsMismatch,
    "Email already registered":
      getCurrentLocale() === "en"
        ? "This email is already registered"
        : "ეს ელ. ფოსტა უკვე დარეგისტრირებულია",
    "Password is required":
      getCurrentLocale() === "en" ? "Password is required" : "საჭიროა პაროლი",
    "Current password is required":
      getCurrentLocale() === "en"
        ? "Current password is required"
        : "საჭიროა მიმდინარე პაროლი",
    "Current password is incorrect":
      getCurrentLocale() === "en"
        ? "Current password is incorrect"
        : "მიმდინარე პაროლი არასწორია",
    "Password changed successfully":
      getCurrentLocale() === "en"
        ? "Password changed successfully"
        : "პაროლი წარმატებით შეიცვალა",
    "Invalid email or password":
      getCurrentLocale() === "en"
        ? "Invalid email or password"
        : "არასწორი ელ. ფოსტა ან პაროლი",
    "Email not verified": messages.auth.emailNotVerified,
    "Email already verified":
      getCurrentLocale() === "en"
        ? "Email is already verified"
        : "ელ. ფოსტა უკვე დადასტურებულია",
    "Authentication required":
      getCurrentLocale() === "en"
        ? "Authentication required"
        : "საჭიროა ავტორიზაცია",
    "User not found":
      getCurrentLocale() === "en" ? "User not found" : "მომხმარებელი ვერ მოიძებნა",
    "Internal server error":
      getCurrentLocale() === "en" ? "Internal server error" : "სერვერის შეცდომა",
    "Token expired":
      getCurrentLocale() === "en" ? "Session expired" : "სესიის ვადა ამოიწურა",
    "Invalid token":
      getCurrentLocale() === "en" ? "Invalid token" : "არასწორი ტოკენი",
    "Authentication failed":
      getCurrentLocale() === "en"
        ? "Authentication failed"
        : "ავტორიზაცია ვერ მოხერხდა",
    "Image file is required":
      getCurrentLocale() === "en"
        ? "Image file is required"
        : "საჭიროა სურათის ფაილი",
    "Only image files are allowed":
      getCurrentLocale() === "en"
        ? "Only image files are allowed"
        : "დაშვებულია მხოლოდ სურათის ფაილები",
    "Request failed": messages.auth.requestFailed,
    "Something went wrong": messages.auth.somethingWrong,
  };
}

export function translateApiError(message: string): string {
  const messages = getMessages(getCurrentLocale());
  const trimmed = message.trim();
  if (!trimmed) return messages.auth.somethingWrong;
  return buildApiErrorMap(messages)[trimmed] ?? trimmed;
}

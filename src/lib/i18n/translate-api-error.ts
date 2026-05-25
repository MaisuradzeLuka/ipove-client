import { messages } from "@/lib/i18n/messages";

/** Maps known English API errors to Georgian UI copy. */
const API_ERROR_MAP: Record<string, string> = {
  "Valid email is required": "საჭიროა სწორი ელ. ფოსტა",
  "Password must be at least 8 characters": "პაროლი მინიმუმ 8 სიმბოლო უნდა იყოს",
  "Confirm password is required": "საჭიროა პაროლის დადასტურება",
  "Passwords do not match": messages.auth.passwordsMismatch,
  "Email already registered": "ეს ელ. ფოსტა უკვე დარეგისტრირებულია",
  "Password is required": "საჭიროა პაროლი",
  "Current password is required": "საჭიროა მიმდინარე პაროლი",
  "Current password is incorrect": "მიმდინარე პაროლი არასწორია",
  "Password changed successfully": "პაროლი წარმატებით შეიცვალა",
  "Invalid email or password": "არასწორი ელ. ფოსტა ან პაროლი",
  "Authentication required": "საჭიროა ავტორიზაცია",
  "User not found": "მომხმარებელი ვერ მოიძებნა",
  "Internal server error": "სერვერის შეცდომა",
  "Token expired": "სესიის ვადა ამოიწურა",
  "Invalid token": "არასწორი ტოკენი",
  "Authentication failed": "ავტორიზაცია ვერ მოხერხდა",
  "Image file is required": "საჭიროა სურათის ფაილი",
  "Only image files are allowed": "დაშვებულია მხოლოდ სურათის ფაილები",
  "Request failed": messages.auth.requestFailed,
  "Something went wrong": messages.auth.somethingWrong,
};

export function translateApiError(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return messages.auth.somethingWrong;
  return API_ERROR_MAP[trimmed] ?? trimmed;
}

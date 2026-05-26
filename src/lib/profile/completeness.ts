import type { User } from "@/lib/auth/types";

export type ProfileCompleteness = {
  percent: number;
  missing: ("name" | "lastname" | "phone" | "city" | "address" | "avatar")[];
};

export function getProfileCompleteness(
  user: User,
  draft?: {
    name?: string;
    lastname?: string;
    phoneNumber?: string;
    city?: string;
    address?: string;
    avatarUrl?: string | null;
  },
): ProfileCompleteness {
  const name = (draft?.name ?? user.name ?? "").trim();
  const lastname = (draft?.lastname ?? user.lastname ?? "").trim();
  const city = (draft?.city ?? user.city ?? "").trim();
  const address = (draft?.address ?? user.address ?? "").trim();
  const phoneRaw = draft?.phoneNumber ?? String(user.phoneNumber ?? "");
  const phone = Number(phoneRaw);
  const avatar = draft?.avatarUrl ?? user.avatar;

  const checks = {
    name: Boolean(name),
    lastname: Boolean(lastname),
    phone: Number.isFinite(phone) && phone > 0,
    city: Boolean(city),
    address: Boolean(address),
    avatar: Boolean(avatar),
  };

  const missing = (
    Object.entries(checks) as [keyof typeof checks, boolean][]
  )
    .filter(([, ok]) => !ok)
    .map(([key]) => key);

  const filled = Object.values(checks).filter(Boolean).length;
  const percent = Math.round((filled / Object.keys(checks).length) * 100);

  return { percent, missing };
}

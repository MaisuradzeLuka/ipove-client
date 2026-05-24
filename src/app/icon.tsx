import { ImageResponse } from "next/og";
import { LogoMarkImage } from "@/components/logo/logo-mark-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<LogoMarkImage fontSize={9} />, { ...size });
}

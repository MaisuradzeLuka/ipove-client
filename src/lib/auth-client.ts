import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { API_BASE } from "@/lib/api/client";

export const authClient = createAuthClient({
  baseURL: API_BASE,
  plugins: [
    inferAdditionalFields({
      user: {
        lastname: { type: "string", required: false },
        phoneNumber: { type: "number", required: false },
        address: { type: "string", required: false },
        city: { type: "string", required: false },
        isComplete: { type: "boolean", required: false },
      },
    }),
  ],
});

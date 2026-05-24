export type User = {
  userId: string;
  email: string;
  name: string | null;
  lastname: string | null;
  phoneNumber: number | null;
  address: string | null;
  city: string | null;
  avatar: string | null;
  examples: string[];
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserPayload = {
  userId: string;
  name: string;
  lastname: string;
  phoneNumber: number;
  address: string;
  city: string;
  avatar?: string;
  examples?: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
  isComplete: boolean;
};

export type ListingStatus = "draft" | "active" | "archived";

export type ListingCategory = {
  categoryId: string;
  slug: string;
  nameKa: string;
  icon: string;
};

export type ListingOwner = {
  userId: string;
  name: string | null;
  lastname: string | null;
  avatar: string | null;
};

export type Listing = {
  listingId: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  city: string;
  experienceYears: number | null;
  hourlyRate: number | null;
  skills: string[];
  examples: string[];
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  category: ListingCategory;
  owner: ListingOwner;
};

export type ListingsResponse = {
  listings: Listing[];
  page: number;
  limit: number;
  total: number;
};

export type ListingResponse = {
  listing: Listing;
};

export type CreateListingPayload = {
  categoryId: string;
  title: string;
  description: string;
  city: string;
  experienceYears?: number;
  hourlyRate?: number;
  skills?: string[];
  examples?: string[];
  status?: ListingStatus;
};

export type UpdateListingPayload = Partial<CreateListingPayload>;

export type ListingsQuery = {
  page?: number;
  limit?: number;
  categoryId?: string;
  categorySlug?: string;
  city?: string;
  q?: string;
};

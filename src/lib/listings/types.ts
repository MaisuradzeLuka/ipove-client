export type ListingStatus = "draft" | "active" | "archived";
export type CompensationType = "one_time" | "monthly" | "hourly" | "negotiable";
export type WorkMode = "onsite" | "remote" | "hybrid";
export type ListingSortBy =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popular";

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
  email?: string;
  phoneNumber?: number | null;
};

export type Listing = {
  listingId: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  experienceYears: number | null;
  hourlyRate: number | null;
  compensationType: CompensationType;
  workMode: WorkMode;
  viewCount: number;
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
  latitude?: number | null;
  longitude?: number | null;
  experienceYears?: number;
  hourlyRate?: number;
  compensationType?: CompensationType;
  workMode?: WorkMode;
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
  groupSlug?: string;
  city?: string;
  q?: string;
  compensationType?: CompensationType;
  minExperience?: number | string;
  workMode?: WorkMode;
  sortBy?: ListingSortBy;
};

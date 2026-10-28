export interface RatingRequest {
  customerName: string;
  stars: number;
  review?: string;
  category?: string;
}

export interface Rating {
  _id: string;
  customerName: string;
  stars: number;
  review: string;
  category: string;
  createdAt: string;
}

export interface RatingsResponse {
  ratings: Rating[];
  average: number;
  totalCount: number;
}

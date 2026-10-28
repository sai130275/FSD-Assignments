export interface FeedbackRequest {
  customerName: string;
  category: string;
  comments: string;
  email?: string;
}

export type FeedbackCategory =
  | 'Service'
  | 'Food Quality'
  | 'Delivery'
  | 'General Suggestion'
  | 'Complaint'
  | 'Compliment';

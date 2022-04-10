export type RequestStatus = 'created' | 'inProgress' | 'readyToReview' | 'review' | 'done' | 'reject';
export type RequestType = 'complaint' | 'reviews';

export interface HumanRequest {
  requestId: string;
  type: RequestType;
  status: RequestStatus;
  tags: string[];
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  institution: string;
  reviewId?: string;
  email: string;
}

export interface Review extends ReviewBody {
  id: string;
}

export interface ReviewBody {
  title: string;
  text: string;
  requests: HumanRequest[];
}

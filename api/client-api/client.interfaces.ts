export interface City {
  city: string;
  organizations: Organization[];
}

interface Organization {
  organizationId: number;
  address: string;
  fullName: string;
  type: string;
}

export type RequestStatus = 'created' | 'inProgress' | 'readyToReview' | 'review' | 'done' | 'reject';
export type RequestType = 'complaint' | 'reviews';

export interface HumanRequest {
  id: string;
  type: RequestType;
  status: RequestStatus;
  tags: string[];
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  institution: string;
}

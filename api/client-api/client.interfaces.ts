export interface City {
  city: string;
  organizations: Organization[];
}

interface Organization {
  id: number;
  address: string;
  fullName: string;
  type: string;
}

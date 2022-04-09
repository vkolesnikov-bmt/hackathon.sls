export interface City {
  city: string;
  organizations: Organization[];
}

interface Organization {
  address: string;
  fullName: string;
  type: string;
}

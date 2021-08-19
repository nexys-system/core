export interface BusinessPartner {
  id: number;
  isObserved: boolean;
  country: { id: number };
  name: string;
  ceid: string;
  recognitionId: number;
  targetedId: number;
  coverageId: number;
  website?: string;
  distributorId?: number;
  wwid?: string;
  description?: string;
  historyUserId?: number;
  tssFriendly: boolean;
}

export type Company = BusinessPartner;

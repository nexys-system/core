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

type Id = number;

export interface Country {
  id: Id;
  name: string;
  iso3166Alpha2: string;
  iso3166Alpha3: string;
  market: { id: Id };
}

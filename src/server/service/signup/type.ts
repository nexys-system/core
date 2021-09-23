export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface BusinessPartnerNew {
  name: string;
  countryCode: string;
  isGoe: boolean;
}

/**
 * different scenarios
 * IBM vs nonIBM
 *
 * if non IBM
 * - company does (not) exist
 * - domain does (not) exist
 */
export interface Signup {
  profile: Profile;
  ceid?: string;
  isIbm?: boolean;
  businessPartnerNew?: BusinessPartnerNew;
  app: TssApp;
}

export enum TssApp {
  academy = 1,
  madeEasy = 2,
}

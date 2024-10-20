import { Candidature } from './candidature';
import { IndividuRole } from './individusRole';
import { Offer } from './offer';
import { RequestSupply } from './requestSupply';
import { User } from './user';

export class Individu extends User {
  identity!: string;
  firstName!: string;
  lastName!: string;
  role!: IndividuRole;
  description!: string;
  requestSupplies!: RequestSupply[];
  candidatures!: Candidature[];
  offers!: Offer[];
}

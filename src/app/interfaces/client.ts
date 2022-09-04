import { Vehicle } from './vehicle';

export interface Client {
  name: string;
  address: string;
  phoneNumber: number;
  vehicle: Vehicle[];
  creationDate: Date;
}

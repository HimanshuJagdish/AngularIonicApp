import { Vehicle } from './vehicle';
export interface Client {
  name: string;
  phoneNumber: number;
  vehicle: Vehicle[];
  address: string;
}

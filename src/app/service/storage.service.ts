import { Injectable } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Client } from '../interfaces/client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  clientArray: Client[] = [];

  constructor(private nativeStorage: NativeStorage) {}

  getSMSList() {
    let clientList: Client[] = [];
    let smsList: any = [];
    //console.log('Client list in get sms list', clientList);
    this.getClientDetailList(clientList);
    console.log('returned to sms client list:', clientList);
    setTimeout(() => {
      clientList.forEach((element) => {
        console.log('element: ', element);
        let currentDate = new Date();
        let clientInsuranceDueDate: Date;
        element.vehicle.forEach((vehicle) => {
          clientInsuranceDueDate = new Date(vehicle.insuranceDueDate);
          const diffTime =
            clientInsuranceDueDate.getTime() - currentDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 15) {
            smsList.push({
              phoneNumber: element.phoneNumber,
              vehicleNumber: vehicle.vehicleNumber,
            });
          }
        });
      });
    }, 3000);
    const observable = new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(smsList);
        subscriber.complete();
      }, 5000);
    });

    //console.log('SMS List', smsList);
    return observable;
  }

  getClientDetailList(clientList) {
    this.nativeStorage
      .keys()
      .then(
        (data) => {
          console.log(data);
          data.forEach((element) => {
            if (element != 'TotalClients' && element != 'InsuredByMe')
              this.pushToClientDataSource(element, clientList);
          });
        },
        (error) => console.log(error)
      )
      .then(() => {
        console.log('client list: ', clientList);

        //this.clientArray = [];
        //callBack(clientList);
      });
  }

  async pushToClientDataSource(client, clientList) {
    console.log('client: ', client);
    await this.nativeStorage
      .getItem(client)
      .then(
        (data) => {
          console.log(data);
          clientList.push(data);
        },
        (err) => console.log(err)
      )
      .catch((err) => console.log(err));
  }
}

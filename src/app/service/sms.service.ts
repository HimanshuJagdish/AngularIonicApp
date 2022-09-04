import { Injectable } from '@angular/core';
import { SMS } from '@ionic-native/sms/ngx';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  constructor(private sms: SMS, private _storageService: StorageService) {}

  sendScheduledSMS() {
    let clientList: any = [];
    this._storageService.getSMSList().subscribe({
      next(smsList: any) {
        console.log('got value ', smsList);
        if (smsList.length > 0) {
          clientList = smsList;
        }
      },
      error(err) {
        console.error('something wrong occurred: ' + err);
      },
      complete() {
        console.log('done');
      },
    });

    setTimeout(() => {
      clientList.forEach((item) => {
        console.log('phone no ', item.phoneNumber);
        console.log('vehicle no ', item.vehicleNumber);

        this.sms
          .send(
            item.phoneNumber,
            `आप की गाडी संख्या ${item.vehicleNumber} का बिमा जल्द ही समाप्त हो रहा ह | अपने वाहन का बिमा  उचित दाम पर करना के लिए इन नम्बरो पर संपर्क करे | इंदु कुमार मरोलिया : 8769199909 |`
          )
          .then((res) => {
            console.log('res', res);
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }, 7000);
  }
}

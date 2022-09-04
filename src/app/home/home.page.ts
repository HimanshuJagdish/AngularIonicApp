import {
  AfterViewInit,
  Component,
  Inject,
  Injectable,
  OnInit,
} from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SMS } from '@ionic-native/sms/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  totalClients = 0;
  insured = 0;
  constructor(private sms: SMS, private nativeStorage: NativeStorage) {}
  ngAfterViewInit(): void {
    this.nativeStorage.getItem('TotalClients').then(
      (res) => {
        this.totalClients = res;
      },
      (err) => {
        console.log('Error getting total  clients:', err);
      }
    );
    this.nativeStorage.getItem('InsuredByMe').then(
      (res) => {
        this.insured = res;
      },
      (err) => {
        console.log('Error getting insured  clients:', err);
      }
    );
  }
  ngOnInit(): void {}

  // sendsms() {
  //   this.sms
  //     .send('7737147503', 'Hello world!')
  //     .then((res) => {
  //       console.log('res', res);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }
}

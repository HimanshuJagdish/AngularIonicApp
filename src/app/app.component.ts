import { Component, OnInit } from '@angular/core';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { SmsService } from './service/sms.service';
import { StorageService } from './service/storage.service';
import { ToastrService } from './service/toastr.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  smsList: any = [];
  constructor(
    private backgroundMode: BackgroundMode,
    private sms: SMS,
    private toastr: ToastrService,
    private nativeStorage: NativeStorage,
    private _storageService: StorageService,
    private _smsService: SmsService
  ) {
    this.getSMSList();
  }
  ngOnInit(): void {
    //this.startSmsService();

    this._smsService.sendScheduledSMS();
    this.backgroundMode.enable();

    this.backgroundMode.on('activate').subscribe(() => {
      setInterval(() => {
        //let smsList: any;
        this._smsService.sendScheduledSMS();
        //console.log('smsList:', smsList);
        //
      }, 24 * 60 * 60 * 1000);
    });
  }

  getSMSList() {
    this._storageService.getSMSList().subscribe({
      next(smsList: any) {
        console.log('got value ', smsList);
        if (smsList.length > 0) {
          this.smsList = smsList;
        }
      },
      error(err) {
        console.error('something wrong occurred: ' + err);
      },
      complete() {
        console.log('done');
      },
    });
  }
}

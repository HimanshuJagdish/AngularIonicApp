import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  constructor(public toastController: ToastController) {}

  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  async presentToastWithOptions(message: any) {
    const toast = await this.toastController.create({
      header: 'Delete Client Record',
      message: message,
      //icon: 'information-circle',
      position: 'middle',
      color: 'danger',
      buttons: [
        {
          text: 'Yes',
          side: 'end',
          role: 'ok',
          //cssClass: 'border:1px solid',
          handler: () => {
            console.log('Delete Confirmed');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    return role;
  }
}

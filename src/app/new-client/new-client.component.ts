import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Client } from '../interfaces/client';
import { ToastrService } from '../service/toastr.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
})
export class NewClientComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private nativeStorage: NativeStorage,
    private toastr: ToastrService
  ) {}
  clients: Client[] = [];
  newClientForm: FormGroup;
  startDate: String = new Date().toISOString();
  insured = false;
  clientExists = false;
  ngOnInit(): void {
    this.newClientForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(20)]],
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern(/^([+]\d{2})?\d{10}$/)],
      ],
      address: [null, [Validators.maxLength(35)]],
      creationDate: [new Date().toISOString()],
      vehicle: this.fb.array([]),
    });
    this.addVehicle();
  }

  createVehicle(): FormGroup {
    return this.fb.group({
      vehicleType: [null, Validators.required],
      vehicleNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z][a-zA-Z]\d\d[a-zA-Z]{1,2}\d\d\d\d/),
        ],
      ],
      //insuredOn: [null, Validators.required],
      insuranceDueDate: [null, Validators.required],
      insurer: [null],
      insuranceType: [null],
      insuranceAmount: [null, [Validators.pattern(/^[0-9]/)]],
      insuredBy: [null, Validators.required],
    });
  }
  get vehicles(): FormArray {
    return this.newClientForm.get('vehicle') as FormArray;
  }

  addVehicle() {
    this.vehicles.push(this.createVehicle());
  }

  addClient() {
    if (this.newClientForm.status == 'VALID') {
      console.log(this.newClientForm.value);

      this.nativeStorage
        .getItem(this.newClientForm.get('phoneNumber').value)
        .then(
          (res) => {
            this.clientExists = true;
            this.newClientForm.get('creationDate').setValue(res.creationDate);
          },
          (err) => {
            this.clientExists = false;
          }
        );

      this.nativeStorage
        .setItem(
          this.newClientForm.get('phoneNumber').value,
          this.newClientForm.value
        )
        .then(
          () => {
            this.toastr.presentToast('Stored Client Details Successfully! ');
            if (!this.clientExists) {
              this.nativeStorage.getItem('TotalClients').then(
                (res) => {
                  this.nativeStorage.setItem('TotalClients', res + 1);
                },
                (err) => {
                  this.nativeStorage.setItem('TotalClients', 1);
                }
              );
              let vehicle = this.newClientForm.get('vehicle') as FormArray;
              let noOfvehicles = vehicle.length;
              for (let i = 0; i < noOfvehicles; i++) {
                if (vehicle.at(i).get('insuredBy').value == 'Me') {
                  this.nativeStorage.getItem('InsuredByMe').then(
                    (res) => {
                      this.nativeStorage.setItem('InsuredByMe', res + 1);
                    },
                    (err) => {
                      this.nativeStorage.setItem('InsuredByMe', 1);
                    }
                  );
                }
              }
            }
            this.newClientForm.reset();
          },
          (error) => this.toastr.presentToast('Error storing Details' + error)
        );
      // this.nativeStorage.getItem('Clients').then(
      //   (data) => {
      //     this.clients = data;
      //     this.addClientToNativeStorage();
      //   },
      //   (error) => {
      //     this.addClientToNativeStorage();
      //     this.toastr.presentToast('No client found' + error)
      //   }
      // );

      // this.nativeStorage
      //   .getItem(this.newClientForm.get('phoneNumber').value)
      //   .then(
      //     (data) => this.toastr.presentToast(data),
      //     (error) => this.toastr.presentToast(error)
      //   );
    } else {
      console.log(this.newClientForm.value);
      this.toastr.presentToast('Please Fill all the details Correctly');
    }
  }

  addClientToNativeStorage() {
    this.clients.push(this.newClientForm.value);
    this.nativeStorage.setItem('Clients', this.clients).then(
      () => this.toastr.presentToast('Added to clientsClients!'),
      (error) => this.toastr.presentToast('Error storing item' + error)
    );
  }

  deleteVehicle(i: number) {
    this.vehicles.removeAt(i);
    if (this.vehicles.length === 0) {
      this.addVehicle();
    }
  }

  clearForm() {
    this.newClientForm.reset();
  }
}

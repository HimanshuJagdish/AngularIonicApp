import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Client } from '../client';
import { ToastrService } from '../service/toastr.service';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss'],
})
export class UpdateClientComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private nativeStorage: NativeStorage,
    private toastr: ToastrService
  ) {}
  clients: Client[] = [];
  newClientForm: FormGroup;
  startDate: String = new Date().toISOString();
  @Input() clientID;
  async ngOnInit(): Promise<void> {
    this.newClientForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(20)]],
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern(/^([+]\d{2})?\d{10}$/)],
      ],
      address: [null, [Validators.maxLength(35)]],
      vehicle: this.fb.array([]),
    });
    this.addVehicle();
    console.log('update client', this.nativeStorage.getItem('1234565432'));
    await this.nativeStorage
      .getItem('1234565432')
      .then(
        async (data) => {
          console.table('data:', data);
          const { address, name, phoneNumber, vehicle } = data;
          await this.newClientForm.patchValue({
            address,
            name,
            phoneNumber,
            vehicle,
          });
          this.newClientForm.get('name').setValue(data.name);
        },
        (err) => {
          console.error('error getting client value:', err);
        }
      )
      .then(() => console.log('new client form', this.newClientForm.value))
      .catch((error) => console.error('error setting value', error));
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
      insuredBy: [null],
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
        .setItem(
          this.newClientForm.get('phoneNumber').value,
          this.newClientForm.value
        )
        .then(
          () => {
            this.toastr.presentToast('Stored Client Details Successfully! ');
            //this.newClientForm.reset();
          },
          (error) => this.toastr.presentToast('Error storing Details' + error)
        );
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

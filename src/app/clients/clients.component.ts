import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Vehicle } from '../interfaces/vehicle';
import { ToastrService } from '../service/toastr.service';
import { Client } from './../interfaces/client';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phoneNumber', 'vehicle', 'action'];
  dataSource = new MatTableDataSource<Client>();

  ds: Client;

  storageData2: Client[] = [];
  clientArray: Client[] = [];
  selectedRowIndex = -1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    private nativeStorage: NativeStorage,
    private toastr: ToastrService,
    private route: Router
  ) {}

  async ngOnInit() {
    await this.initClientDataList();
  }

  async initClientDataList() {
    await this.nativeStorage
      .keys()
      .then(
        (data) => {
          //this.toastr.presentToast(data);
          console.log(data);
          data.forEach((element) => {
            if (element != 'TotalClients' && element != 'InsuredByMe')
              this.pushToClientDataSource(element);
          });
        },
        (error) => this.toastr.presentToast(error)
      )
      .then(() => {
        console.log('client arrar: ', this.clientArray);
        // this.dataSource.data = this.clientArray;
        setTimeout(() => {
          this.dataSource.data = this.clientArray;
        }, 1000);
      })
      .catch((err) => console.log(err));
  }

  async pushToClientDataSource(client) {
    console.log('client: ', client);
    await this.nativeStorage
      .getItem(client)
      .then(
        (data) => {
          console.log(data);
          this.clientArray.push(data);
        },
        (err) => console.log(err)
      )
      .catch((err) => console.log(err));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async deleteClientDetails(id: string) {
    const role = await this.toastr.presentToastWithOptions(
      'Are you shure you want to delete client record ?'
    );
    if (role == 'ok') {
      for (let i = 0; i < this.clientArray.length; i++) {
        if (this.clientArray[i].phoneNumber.toString() == id) {
          this.clientArray.splice(i, 1);
          this.dataSource.data = this.clientArray;

          this.nativeStorage.getItem(id).then((res) => {
            res.vehicle.forEach((item) => {
              if (item.insuredBy == 'Me') {
                this.nativeStorage.getItem('InsuredByMe').then(
                  (res) => {
                    this.nativeStorage.setItem('InsuredByMe', res - 1);
                  },
                  (err) => {
                    console.log('Error getting insured Clients');
                  }
                );
              }
            });
            this.nativeStorage.getItem('TotalClients').then(
              (res) => {
                this.nativeStorage.setItem('TotalClients', res - 1);
              },
              (err) => {
                console.log('Error getting total Clients');
              }
            );
            this.nativeStorage.remove(id);
          });
          break;
        }
      }
    }
  }
  // updateClientDetails(id: string) {
  //   console.log('update client');
  //   this.route.navigateByUrl('updateClient');
  // }

  showClientDetails(id: string, index) {
    this.selectedRowIndex = index;
    this.nativeStorage.getItem(id).then((res) => {
      this.ds = res;
    });
  }
}

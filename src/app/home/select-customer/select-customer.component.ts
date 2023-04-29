import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {DatabaseService} from "../../providers/database/database.service";
import {DemoDataService} from "../../providers/demo-data/demo-data.service";
import {listAnimation} from "../../../_animation/animations";
import {ToastService} from "../../providers/toast/toast.service";
import { CustomerService } from '../../_services/customer.service';

@Component({
    selector: 'app-select-customer',
    templateUrl: './select-customer.component.html',
    styleUrls: ['./select-customer.component.scss'],
    animations:[listAnimation]
})
export class SelectCustomerComponent implements OnInit {

    public isLoading = true;
    public customers: any[] = [1,1,1,1,1];
    private customerData: any[];
    public searchValue = "";
    constructor(
        private modalCtrl: ModalController,
        public data: DemoDataService,
        private toast: ToastService,
        private customerService: CustomerService
    ) { }

    ngOnInit() {}

    ionViewWillEnter(){
        setTimeout(()=> {
            this.isLoading = false;
            // this.customerData = this.data.customers;
            // this.customers = this.data.customers;

            this.customerService.getCustomer()
            .subscribe(customer => {
              this.customers=customer;
              this.customerData=customer;
              console.log('get all customers: ',this.customers)
              console.log("customerData list: ",this.customerData);
            }, error => {
              console.log(error);
            });            
        }, 1200);
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    searchProducts($event: any) {
        console.log($event.target.value);
        this.searchValue = $event.target.value;
        this.searchData();
    }

    searchData(){
        this.customers = this.customerData.filter(customer=> {
            if (customer.name.toString().indexOf(this.searchValue) > -1 || customer.name.toLowerCase().indexOf(this.searchValue) > -1){
                return  customer;
            }
        });
    }

    cancelSearch() {
        this.customers = this.customerData;
        this.searchValue="";
    }
    selectCustomer(customer){
        this.modalCtrl.dismiss(customer);
        this.toast.presentToast('Customer Selected', 'success-toast');
    }

    loadCustomerData(event: any) {
        console.log('loadCustomerData event: ',event);
        setTimeout(() => {
            this.customers.push(...this.customerData);
            console.log('loadCustomerData: ',this.customers);
            this.searchData();
            event.target.complete();
            // App logic to determine if all data is loaded
            // and disable the infinite scroll
            if (this.customers.length >= 50) {
                event.target.disabled = true;
            }
        }, 500);
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IOrder } from 'src/app/_models/order';
import { InvoiceService } from 'src/app/_services/Invoice.service ';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  //orders:IOrder[];
  orders: any;
  constructor(
    private orderService:OrderService,
    private invoiceService:InvoiceService,
    private loadingController: LoadingController,
    public router: Router,
  ) { }

  ngOnInit() {
     this.getOrders();
  }

  //Gets all orders.
  getOrders(){

    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
      loadingEl.present();
      this.orderService.getOrdersForUser().subscribe(data=>{
        this.orders=data;
        console.log("Getting orders..");
        console.log('orders: ',this.orders);
        loadingEl.dismiss();
      },error => {
        console.log(error);
      });
    });
    }

    //Delets an order by id.
    deleteOrder(id){

      this.loadingController
      .create({ message:"Cancel the order..."})
      .then(loadingEl => {
          loadingEl.present();
          this.orderService.deleteOrder(id).subscribe(()=>
          {
            loadingEl.dismiss();
            this.getOrders();
          });
    });
    }

    getOrderdetails(orderId: any)
    {
      console.log('getproduct details:',orderId);
      this.router.navigate(['/home/orders/order-details/' + orderId]);
    }

   
    //Delets an order by id.
    createInvoice(orderId){
console.log('Create Invoice: ',orderId);
      this.loadingController
      .create({ message:"converting sales Invoice..."})
      .then(loadingEl => {
          loadingEl.present();

          this.invoiceService.createInvoice(orderId).subscribe(()=>
          {
            loadingEl.dismiss();
            this.getOrders();
          });
    });
    }
}

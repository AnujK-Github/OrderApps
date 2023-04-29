import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IOrder, IOrderItem } from 'src/app/_models/order';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  order:IOrderItem[]=[];
 // orderId:number;
 orders:IOrder;
 routeSub: any;
 orderID: any;
 customerOrders:any;
 orderDetails: any;
 total: any; 
  totalItems: any;
  constructor(
    private orderService:OrderService,
    private activatedRoute:ActivatedRoute,
    private loadingController: LoadingController,
    private router: Router
  ) 
  {
    this.activatedRoute.params.subscribe(params => {
      this.routeSub = params;
      this.orderID = this.routeSub.id;     
      console.log('route order id', this.orderID)
    });
   }

  ngOnInit() {
    this.getOrderById();
  }

  //Gets an order by id.
  getOrderById()
  {
    console.log(' getOrderById() : ',this.orderID);
    // this.orderService.getOrderDetailed(+this.activatedRoute.snapshot.paramMap.get('id'))
    this.orderService.getOrderDetailed(this.orderID)
    .subscribe((data)=>
    {      
      this.customerOrders=data;
      this.orderDetails= this.customerOrders.orderDetails;
      console.log('orders: ',this.customerOrders);
      console.log('orderDetails: ', this.orderDetails);
      var sum = 0;
      var itemCount=0;
      console.log(this.orderDetails);
      for(let order of this.orderDetails){
        sum = sum + order.quantity * order.price;
        itemCount=  itemCount+1;
      }
      this.totalItems=itemCount;
      this.total = Math.round(sum*100)/100;
        console.log(this.total);
    });
    // .subscribe((orderDetailed:IOrder)=>
    // {
    //   this.order=orderDetailed.orderItems;
    //   console.log('orderDetails: ',this.order);
    // });
  }

}

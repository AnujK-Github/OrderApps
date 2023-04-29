import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IOrder, IOrderItem } from 'src/app/_models/order';
import { InvoiceService } from 'src/app/_services/Invoice.service ';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.page.html',
  styleUrls: ['./invoice-details.page.scss'],
})
export class InvoiceDetailsPage implements OnInit {

  order:IOrderItem[]=[];
 // orderId:number;
 orders:IOrder;
 routeSub: any;
 invoiceId: any;
 customerInvoice:any;
 invoiceDetails: any;
 total: any; 
  totalItems: any;
  constructor(
    private orderService:OrderService,
    private activatedRoute:ActivatedRoute,
    private loadingController: LoadingController,
    private router: Router,
    private invoiceService:InvoiceService
  ) 
  {
    this.activatedRoute.params.subscribe(params => {
      this.routeSub = params;
      this.invoiceId = this.routeSub.Id;     
      console.log('route invoice id', this.invoiceId)
    });
   }

  ngOnInit() {
    this.getInvoiceDetailsById();
  }

  //Gets an order by id.
  getInvoiceDetailsById()
  {
    console.log(' getInvoiceDetailsById() : ',this.invoiceId);
    // this.orderService.getOrderDetailed(+this.activatedRoute.snapshot.paramMap.get('id'))
    this.invoiceService.getInvoiceDetails(this.invoiceId)
    .subscribe((data)=>
    {      
      this.customerInvoice=data;
      this.invoiceDetails= this.customerInvoice.salesDetails;
      console.log('Invoice  : ',this.customerInvoice);
      console.log('InvoiceDetails: ', this.invoiceDetails);
      var sum = 0;
      var itemCount=0;
      console.log(this.invoiceDetails);
      for(let invoice of this.invoiceDetails){
        sum = sum + invoice.quantity * invoice.unitPrice;
        itemCount=  itemCount+1;
      }
      this.totalItems=itemCount;
      this.total = Math.round(sum*100)/100;
        console.log('Total items: ',this.totalItems);
        console.log('Total: ',this.total);
    });
    // .subscribe((orderDetailed:IOrder)=>
    // {
    //   this.order=orderDetailed.orderItems;
    //   console.log('orderDetails: ',this.order);
    // });
  }

}

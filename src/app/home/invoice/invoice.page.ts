import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IOrder } from 'src/app/_models/order';
import { InvoiceService } from 'src/app/_services/Invoice.service ';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {

  //orders:IOrder[];
  invoiceList: any;
  printInvoice: any;
  constructor(
    private orderService:OrderService,
    private invoiceService:InvoiceService,
    private loadingController: LoadingController,
    public router: Router,
  ) { }

  ngOnInit() {
     this.getInvoiceList();
  }

  //Gets all orders.
  getInvoiceList(){

    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
      loadingEl.present();
      this.invoiceService.getInvoiceList().subscribe(data=>{
        this.invoiceList=data;        
        console.log('InvoiceList: ',this.invoiceList);
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
          this.invoiceService.deleteOrder(id).subscribe(()=>
          {
            loadingEl.dismiss();
            this.getInvoiceList();
          });
    });
    }

    getInvoiceetails(invoiceId: any)
    {
      console.log('get Invoice details:',invoiceId);
      // this.router.navigate(['/home/invoice/invoice-details/' + invoiceId]);
      this.router.navigate(['/home/invoice/invoice-details/'+ invoiceId]);
    
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
            this.getInvoiceList();
          });
    });
    }

    onPreviewImage(value: any) {
      console.log('OnPreview image id:', value);
      this.invoiceService.getPrintInvoice(value.id).subscribe(data => {
        this.printInvoice = data;
        console.log('printInvoice:', this.printInvoice);
      })
    }
}

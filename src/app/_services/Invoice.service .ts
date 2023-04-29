import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IInvoiceToCreate, IOrderToCreate } from '../_models/order';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  baseUrl = environment.apiUrl+'api/';
  isOrderDone=false;

  constructor(private http: HttpClient) { }

  //Creates an order.
  creatOrder(order: IOrderToCreate) {

    return this.http.post(this.baseUrl + 'invoice', order );
  }

   //Creates an order.
 createInvoice(orderNo: any) {

  return this.http.get(this.baseUrl + 'Invoice/CreateInvoce?OrderNo='+ orderNo);
}
  //Returns all orders.
  getInvoiceList() {
    return  this.http.get(this.baseUrl + 'invoice');
   
  }

  //Returns an order by Id.
  getInvoiceDetails(id: any) {
    return this.http.get(this.baseUrl + 'invoice/' + id);
  }

  //Deletes an order by Id.
  deleteOrder(id:string){
    return this.http.delete(this.baseUrl + 'orders/' + id);
  }
  //PDF an Invoice.
 getPrintInvoice(invoiceNo: any) {

  return this.http.get(this.baseUrl + 'Invoice/GetPrintInvoce?InvoiceNo='+ invoiceNo);
}
}

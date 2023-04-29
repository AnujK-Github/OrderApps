import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../_models/category';
import { IProduct } from '../_models/product';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICustomer } from '../_models/customer';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  baseUrl = environment.apiUrl+'api/';
  products: IProduct[] = [];
  customer: ICustomer[] = [];

  constructor(private http: HttpClient) { }

  //Gets all customer.
  getCustomer() 
  {
    console.log('get customer baseUrl: ',this.baseUrl );
    // return this.http.get(this.baseUrl+'api/MiniPOS/products');
    return this.http.get<[]>(this.baseUrl + 'customer')
  }

  //Gets a product by Id.
  getCustomerById(id: string)
  {
    console.log('get customer by id ',id)
    return this.http.get<ICustomer>(this.baseUrl + 'customer/' + id);
  }

 
}

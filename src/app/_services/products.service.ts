import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../_models/category';
import { IProduct } from '../_models/product';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  baseUrl = environment.apiUrl;
  products: IProduct[] = [];
  category: ICategory[] = [];
  getAllProductsUrl=this.baseUrl+'api/products';
  getAllCategoryUrl=this.baseUrl+'api/products/categories';
  getCategoryProductsUrl=this.baseUrl+'api/products/categoryporducts';
  // getAllProductsUrl='https://151.192.64.18:1792/apps/api/products';
  // getAllCagegoryUrl='https://151.192.64.18:1792/apps/api/products/categories';
  // getAllProductsUrl='http://192.168.48.53:5352/api/products';
  // getAllCagegoryUrl='http://192.168.48.53:5352/api/products/categories';
 
  

  // constructor(private http: HttpClient) { }


   // Http Options
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

    // Handle API errors
handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
};

constructor(public http: HttpClient) { }

  //Gets all products.
  
  getProducts(){
     console.log('getAllProductsUrl:  ',this.getAllProductsUrl);
    return new Promise(resolve =>{
      this.http.get(this.getAllProductsUrl).subscribe(data =>{
        resolve(data);
        console.log(data);
      },
        err => {
          console.log(err);
      });
    });
  }
  getCategoryProducts(categoryId: any){
    console.log('getAllProductsUrl:  ',this.getCategoryProductsUrl);
   return new Promise(resolve =>{
     this.http.get(this.getCategoryProductsUrl+'/' + categoryId).subscribe(data =>{
       resolve(data);
       console.log(data);
     },
       err => {
         console.log(err);
     });
   });
 }

  // getProducts() 
  // {
  //   console.log('getAllCagegoryUrl:  ',this.getAllProductsUrl);
  //   return this.http.get(this.getAllProductsUrl);
  // }

  //Gets a product by Id.
  getProduct(id: string)
  {
    console.log('getProduct ',id)
    return this.http.get(this.getAllProductsUrl+'/' + id);
  }

  //Gets all categories.
  // getCategories() 
  // {
  //   console.log('getAllCagegoryUrl:  ',this.getAllCagegoryUrl);
    
  //   return this.http.get(this.getAllCagegoryUrl);
  //   // .pipe(
  //   //   map(response => {
  //   //     this.category = response;
  //   //     console.log('category response:  ', this.category);
  //   //     return response;
  //   //   })
  //   // );
  // }

  // getCategories() 
  // {
  //   console.log('get All CagegoryUrl:  ',this.getAllCagegoryUrl);
  //   return this.http.get(this.getAllCagegoryUrl);
  // }
  getCategories(){
    console.log('getAllP CagegoryUrl:  ',this.getAllCategoryUrl);
   return new Promise(resolve =>{
     this.http.get(this.getAllCategoryUrl).subscribe(data =>{
       resolve(data);
       console.log(data);
     },
       err => {
         console.log(err);
     });
   });
 }
 
}

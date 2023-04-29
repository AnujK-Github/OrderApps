import { Component, OnInit ,Input,Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { IProduct } from 'src/app/_models/product';
import { ProductsService } from 'src/app/_services/products.service';
import { environment } from 'src/environments/environment';
import { ICustomer } from '../../_models/customer';
import { CustomerService } from '../../_services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {


  customers:ICustomer[]=[];
  baseUrl = environment.apiUrl;
  constructor(
    private productsService : ProductsService,
    public activatedRoute:ActivatedRoute,
    private loadingController: LoadingController,
    private customerService: CustomerService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.getCustomers();
  }
 
  getCustomerdetails(customerId: any)
  {
    console.log('get customer details:',customerId);
    this.router.navigate(['/home/customers/' + customerId]);
  }

  //Gets all products from database and filters products by Category Id.
  getCustomers()
  {
    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
      loadingEl.present();
            this.customerService.getCustomer().subscribe(response => {
              this.customers = response;              
              loadingEl.dismiss();
              console.log('customer page: ',this.customers);
            }                 
          //   .pipe(
          //    map(products => {
          //     this.products=products.filter(p => p.categoryId === (+this.activatedRoute.snapshot.paramMap.get('id'))) ;
          // }))
          // .subscribe(()=>
          // { 
          //   loadingEl.dismiss();
          // }
          , error => {
            console.log(error);
          });   
    });
    
  }
  // getProducts()
  // {
  //   console.log('getproducts by categoryid: ',(+this.activatedRoute.snapshot.paramMap.get('id')).toString());
  //   this.loadingController
  //   .create({ message:"loading..."})
  //   .then(loadingEl => {
  //     loadingEl.present();
  //           this.productsService.getProducts()
  //           .pipe(
  //            map(products => {
  //             this.products=products.filter(p => p.categoryId ===  (+this.activatedRoute.snapshot.paramMap.get('id')).toString()) ;
  //         }))
  //         .subscribe(()=>
  //         { 
  //           loadingEl.dismiss();
  //         }, error => {
  //           console.log(error);
  //         });   
  //   });
    
  // }

}

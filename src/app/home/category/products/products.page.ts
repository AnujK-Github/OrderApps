import { Component, OnInit ,Input,Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { IProduct } from '../../../_models/product';
import { ProductsService } from '../../../_services/products.service';
import { environment } from '../../../../environments/environment';
import {listAnimation} from "../../../../_animation/animations";
import {LoaderService} from "../../../providers/loader/loader.service";
import {AlertService} from "../../../providers/alert/alert.service";
import {DatabaseService} from "../../../providers/database/database.service";
import {DemoDataService} from "../../../providers/demo-data/demo-data.service";
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  animations:[listAnimation]
})
export class ProductsPage implements OnInit {
  public allproducts: any ; //[] =[1,1,1,1];
  products:any;
  private searchValue: String = "";
  private catId;
  baseUrl = environment.apiUrl;
  routeSub: any;
  categoryID: any;
  constructor(
    private productsService : ProductsService,
    public activatedRoute:ActivatedRoute,
    private loadingController: LoadingController,
    public router: Router,
    public data: DemoDataService,
    private loader: LoaderService,
    private alert: AlertService,
    private navCtrl: NavController
  
  ) {  this.activatedRoute.params.subscribe(params => {
    this.routeSub = params;
    console.log('route id', this.routeSub)
    this.categoryID = this.routeSub.id;     
    console.log('route category id', this.categoryID)
  });}

  ngOnInit() {
    this.getCategoryProducts();
  }
  goBack() {
    this.navCtrl.back();
  }
  searchByProductName(value: any)
  {
    this.products= this.products.filter(x=>x.description == value);
  }
  getProductdetails(productId: any)
  {
    console.log('getproduct details:',productId);
    this.router.navigate(['/home/tabs/category/productdetail/' + productId]);
  }
   //Gets all products from database and filters products by Category Id.
   getCategoryProducts()
   {
     this.loadingController
     .create({ message:"loading..."})
     .then(loadingEl => {
       loadingEl.present();
             this.productsService.getCategoryProducts(this.categoryID).then(data => {
               this.products = data;
              this.allproducts=this.products;
               loadingEl.dismiss();
               console.log('Product page: ',this.products);
             } 
           , error => {
             console.log(error);
           });   
     });
     
   }

  //Gets all products from database and filters products by Category Id.
  getProducts()
  {
    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
      loadingEl.present();
            this.productsService.getProducts().then(data => {
              this.products = data;
              // this.allproducts=data;
              this.products =this.products.filter(p=>p.categoryId == this.categoryID);
              this.allproducts=this.products;
              loadingEl.dismiss();
              console.log('Product page: ',this.products);
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
  //             this.products=products.filter(p => p.categoryId === this.categoryID) ;
  //         }))
  //         .subscribe(()=>
  //         { 
  //           loadingEl.dismiss();
  //         }, error => {
  //           console.log(error);
  //         });   
  //   });
    
  // }

  searchProducts($event: any) {
    this.searchValue = $event.target.value;
    this.searchData();
}
searchData(isLoad?){
    if (this.searchValue == "" && !isLoad){
      this.products= this.allproducts;
        // this.products = this.products.filter(product=> {
        //     // if(this.catWishProduct(product)){
        //     //   console.log("Search data 1"); 
        //     //     return  product;
        //     // }
        //     console.log("Search data 1"); 
        //     return product;
        // })
    }else if(isLoad){
        this.products = this.products.filter(product=> {
            if(this.catWishProduct(product)){
              console.log("Search data 2"); 
                return  product;
            }
        })
    }else{
        this.products = this.products.filter(product=> {
          if (product.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 ){
            // if (product.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1 && this.catWishProduct(product)){
              console.log("Search data 3"); 
              return product;
            }
        });
    }

}
loadData(event: any) {
    setTimeout(() => {
       // this.products.push(...this.products);
        this.searchData(1);
        event.target.complete();
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.products.length == 100) {
            event.target.disabled = true;
        }
    }, 500);
}
cancelSearch() {
    this.searchValue="";
    this.searchData();
}
catWishProduct(product){
  console.log("catWishProduct Search data ",product); 
  if(this.catId && this.catId > 0){
      if (product.categoryId == this.catId){
          return  true;
      }else{
          return false;
      }
  }else{
      return true;
  }
}

}

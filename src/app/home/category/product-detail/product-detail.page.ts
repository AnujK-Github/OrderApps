import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { IOrderToCreate } from 'src/app/_models/order';
import { IProduct } from '../../../../app/_models/product';
import { CartService } from '../../../../app/_services/cart.service';
import { OrderService } from '../../../../app/_services/order.service';
import { ProductsService } from '../../../../app/_services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  baseUrl = environment.apiUrl;
  products:any;
  product: any;
  quantity=1;
  isCartSet=this.cartService.isCartSet;

  routeSub: any;
  productID: any;
  constructor(
    private productsService:ProductsService,
    private cartService:CartService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    public toastController: ToastController,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { 
    this.activatedRoute.params.subscribe(params => {
      this.routeSub = params;
      this.productID = this.routeSub.productId;     
      console.log('route id', this.productID)
    });
  }

  ngOnInit() {
    this.loadProduct();
    this.getProducts();
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  goBack() {
    this.navCtrl.back();
  }

  // //Gets product by its Id.
  // loadProduct() {
  //   this.loadingController
  //   .create({ message:"loading..."})
  //   .then(loadingEl => {
  //         loadingEl.present();
  //         this.productsService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id'))
  //       .subscribe((product) => 
  //       {
  //           this.product = product;
  //           console.log('Load Product by Id: ', this.product);
  //           loadingEl.dismiss();
  //       }, error => {
  //         console.log(error);
  //       });  
  //   });
  //   //this.product=this.products.find(p=> p.id  ===  (+this.activatedRoute.snapshot.paramMap.get('productId')));
  // }

  //Gets product by its Id.
  loadProduct() {
    console.log(' get product id ',this.productID)
    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
          loadingEl.present();  
          this.productsService.getProduct(this.productID)
        .subscribe((product) => 
        {
            this.product = product;          
            console.log('load product by id : ',this.product);
            loadingEl.dismiss();
        }, error => {
          console.log(error);
        });  
    });
    //this.product=this.products.find(p=> p.id  ===  (+this.activatedRoute.snapshot.paramMap.get('productId')));
  }
  
  getProductDetails()
  {
    
    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
          loadingEl.present();
          console.log('getProductDetails id : ', this.productID);
          this.productsService.getProduct(this.productID)
        .subscribe((product) => 
        {
            this.product = product;
            console.log('getProductDetails by id : ',this.product);
            loadingEl.dismiss();
        }, error => {
          console.log(error);
        });  
    });
  }

  //Adds items into cart. 
  addToCart() {
console.log('addToCart : ', this.product);
    this.loadingController
    .create({ message:"adding.."})

    
    .then(loadingEl => {
        loadingEl.present();
       // console.log("addToCart: ",this.product);
      // this.product.thumbnailUrl=this.product.thumbnailUrl;
      //  console.log('thumbnailUrl:',this.product.thumbnailUrl);
       console.log('additemtocart:',this.product);
        this.cartService.addItemToCart('CUS-001',this.product, this.quantity);
        
          loadingEl.dismiss();
          this.presentToast();
        
        this.router.navigateByUrl('/home/tabs/cart');
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Added to cart successfully.',
      duration: 2000
    });
    toast.present();
  }
  
  //Gets all products.
  getProducts()
  {
    this.productsService.getProducts().then(products => {
      this.products=products;
      console.log('get all Products: ',this.products)
    }, error => {
      console.log(error);
    });
  }

}

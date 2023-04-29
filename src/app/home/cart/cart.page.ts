import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ICart, ICartItem, ICartTotals } from 'src/app/_models/cart';
import { IOrderItem } from 'src/app/_models/order';
import { IProduct } from 'src/app/_models/product';
import { CartService } from 'src/app/_services/cart.service';
import { OrderService } from 'src/app/_services/order.service';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CustomersPage } from '../customers/customers.page';
import { CustomerService } from '../../_services/customer.service';
import {SelectCustomerComponent} from "../../home/select-customer/select-customer.component";
import { __values } from 'tslib';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  public selectedCustomer : any;
  public isLoading = true;
  product:IProduct[]=[];
  cart$: Observable<ICart>;
  cartTotals$: Observable<ICartTotals>;
  cartIds: string;
  item: ICart;
  customers: any;
  total: any; 
  totalItems: any;
  constructor(
    private cartService: CartService,
    private orderService:OrderService,
    private router:Router,
    private loadingController: LoadingController,
    public toastController: ToastController,
    private customerService:CustomerService,
    private alertCtrl: AlertController,    
    private modalCtrl: ModalController,
    ) { }

  ngOnInit() {
    this.cart$ = this.cartService.cart$;
    this.cartTotals$ = this.cartService.cartTotal$;
    this.getCart();
  }

  //Gets the cart from Redis database.
  getCart() {
    const cartId = localStorage.getItem('cart_id');
    this.cartIds=cartId;
    console.log("card Id: ", cartId);
    
    if (cartId) {
     this.cartService.getCart(cartId).subscribe(() => {

        var sum = 0;
        var itemCount=0;
      
        // for(let order of (cart$).items ){
        //   sum = sum + order.quantity * order.price;
        //   itemCount=  itemCount+1;
        // }
        this.totalItems=itemCount;
        this.total = Math.round(sum*100)/100;
          console.log(this.total);

        console.log('initialised basket');
        console.log('Get card details:' ,);
      }, error => {
        console.log(error);
      });
    }
  }
  getCustomers(value:any)
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

  incrementItemQuantity(item: ICartItem) {
    this.cartService.incrementItemQuantity(item);
  }

  decrementItemQuantity(item: ICartItem) {
    this.cartService.decrementItemQuantity(item);
  }
  
  //Removes single item from cart.
  removeFromCart(item)
  {
    this.cartService.removeItemFromCart(item);
  }

  //Creates orders.
   createOrder()
  { 
    const cart = this.cartService.getCurrentCartValue();
    try {
      const orderToCreate = this.getOrderToCreate(cart);

      this.loadingController
      .create({ message:"placing order.."})
      .then(loadingEl => {
            loadingEl.present();
            this.orderService.creatOrder(orderToCreate).subscribe(()=>{
              this.cartService.deleteCart(cart);
              this.selectedCustomer="";
              loadingEl.dismiss();
              this.presentToast();
              this.router.navigate(["/home/orders"]);
            });       
      });     
    } 
    catch (error) {
      console.log(error);
    }
  }

  private getOrderToCreate(cart: ICart) {
    return {
      cartId: cart.id
    };
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Order placed successfully.',
      duration: 2000
    });
    toast.present();
  }

  
//Deletes cart from Redis database.
deleteCart(item: string)
{
  this.loadingController
  .create({ message:"deleting.."})
  .then(loadingEl => {
    loadingEl.present();
    console.log("delete cart: ", item);  
    this.cartService.deleteCart(item);
    loadingEl.dismiss();
  });
}

// //Deletes cart from Redis database.
//   deleteCart(item: any)
//   { 
//     this.loadingController
//     .create({ message:"deleting.."})
//     .then(loadingEl => {
//       loadingEl.present();
//       console.log("delete cart: ", item);  

//       this.cartService.deleteCart(item);

//       loadingEl.dismiss();
//     });
//   }
 
  async onAddCustomer(){
    const modal = await this.modalCtrl.create({
        component: SelectCustomerComponent,
        cssClass: 'select-customer-modal',
        animated: true,
        mode: "ios"
    })
    modal.onWillDismiss()
        .then(data=> {
           
            this.selectedCustomer = data['data'];

            console.log(' selected customer: ',this.selectedCustomer);
            console.log(' cart details: ',this.cart$);
            this.cartService.updateSelectedCustomer(this.selectedCustomer.id);
            //this.cart$._value.id=this.selectedCustomer.id;
        });


    return await modal.present();

}

}

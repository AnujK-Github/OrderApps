import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cart, ICart, ICartItem, ICartTotals } from '../_models/cart';
import { IProduct } from '../_models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = environment.apiUrl+'api/';
  
  private cartSource = new BehaviorSubject<ICart>(null);
  cart$ = this.cartSource.asObservable();
  
  private cartTotalSource = new BehaviorSubject<ICartTotals>(null);
  cartTotal$ = this.cartTotalSource.asObservable();
  shipping = 0;
  isCartSet=false;

  constructor(private http: HttpClient) { }

  //Gets cart from Redis database.
  getCart(id: string) {
    return this.http.get(this.baseUrl + 'cart?id=' + id)
      .pipe(
        map((cart: ICart) => {
          this.cartSource.next(cart);
          if(this.cartSource)
          {this.calculateTotals();}
          console.log("cart details: ",cart);
        })
      );
  }

  //Saves the cart into Redis database
  setCart(cart: ICart) {
    this.isCartSet=true;
    return this.http.post(this.baseUrl + 'cart', cart).subscribe((response: ICart) => {
      
      this.cartSource.next(response);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  //Returns current cart value.
  getCurrentCartValue() {
    return this.cartSource.value;
  }

  //Adds item to cart
  addItemToCart(customerId: any,item: any, quantity = 1) {
    console.log("add item:" ,item);
    const itemToAdd: ICartItem = this.mapProductItemToCartItem(item, quantity);
    let cart = this.getCurrentCartValue();
    console.log("cart value:" ,itemToAdd);
    if (cart === null) {
      cart = this.createCart();
    }
    cart.items = this.addOrUpdateItem(cart.items, itemToAdd, quantity);
    cart.customerId = customerId;
    console.log('cart: ',cart);
    console.log('cart customer: ',cart.customerId);
    console.log('cart item: ',cart.items);
    this.setCart(cart);
  }
  updateSelectedCustomer(customerId: any) {
    const cart = this.getCurrentCartValue();
    cart.customerId=customerId;
    this.setCart(cart);
    console.log('customer id - updated to cart details: ',cart);
  }

  //Increments item quantity.
  incrementItemQuantity(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    const itemIndex = cart.items.findIndex(x => x.productId === item.productId);
    cart.items[itemIndex].quantity++;
    this.setCart(cart);
  }

  //Decrements item quantity.
  decrementItemQuantity(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    const itemIndex = cart.items.findIndex(x => x.productId === item.productId);
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity--;
      this.setCart(cart);
    } else {
      this.removeItemFromCart(item);
    }
  }

  //Removes single item from cart.
  removeItemFromCart(item: ICartItem) {
    const cart = this.getCurrentCartValue();
    if (cart.items.some(x => x.productId === item.productId)) {
      cart.items = cart.items.filter(i => i.productId !== item.productId);
      if (cart.items.length > 0) {
        this.setCart(cart);
      } else {
        this.deleteCart(cart);
      }
    }
  }

  //Deletes cart id from localStorage.
  deleteLocalCart(id: string) {
    this.cartSource.next(null);
    this.cartTotalSource.next(null);
    localStorage.removeItem('cart_id');
  }

   //Deletes whole cart from Redis database.
   deleteCart(cart: any) {
    this.cartSource.next(null);
    this.cartTotalSource.next(null);
    localStorage.removeItem('cart_id');
    // const cartDet = this.getCurrentCartValue();   
    // console.log("deleteCart (local items): ", cart);  
    // this.deleteCart(cartDet);  
    

    // console.log("deleteCart (service): ", cart);  
    // return this.http.delete(this.baseUrl + 'cart?id=' + cart).subscribe(() => {
    //   this.cartSource.next(null);
    //   this.cartTotalSource.next(null);
    //   localStorage.removeItem('cart_id');
    // }, error => {
    //   console.log(error);
    // });
  }

  // //Deletes whole cart from Redis database.
  // deleteCart(cart: ICart) {  
  //   console.log("delete cart from cart service:", cart);
  //   console.log("cart delete url:", this.baseUrl + 'cart?id=' + '01c892f3-976b-4b7a-afa7-4a7d0ec211ee');
  //   // return this.http.delete(this.baseUrl + 'cart/deletecart/' + cartid);
  //   return this.http.delete(this.baseUrl + 'cart?id=' + '01c892f3-976b-4b7a-afa7-4a7d0ec211ee')
  //   // return this.http.delete(this.baseUrl + 'cart/deletecart/' + cart.id).subscribe(() => {
  //   //   this.cartSource.next(null);
  //   //   this.cartTotalSource.next(null);
  //   //   console.log('delete card: ', 'cart_id');
  //   //   localStorage.removeItem('cart_id');
  //   // }, error => {
  //   //   console.log(error);
  //   // });
  // }

  //Calculates total value.
  private calculateTotals() {
    const cart = this.getCurrentCartValue();
    const shipping = this.shipping;
    const subtotal = cart.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.cartTotalSource.next({shipping, total, subtotal});
  
  }

  //Adds a new item. If item already exists in cart, updates its quantity.
  private addOrUpdateItem( items: ICartItem[], itemToAdd: ICartItem, quantity: number): ICartItem[] {
    const index = items.findIndex(i => i.productId === itemToAdd.productId);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  //Saves Cart Id into localStorage.
  private createCart(): ICart {
    const cart = new Cart();

    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  //Maps product item into cart item.
  private mapProductItemToCartItem(item: any, quantity: number): ICartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      thumbnailUr: item.thumbnailUrl,
      quantity,
      categoryId: item.categoryId,
      unitId:item.unitId,
      uom:item.unit.name
    };
  }

  
}

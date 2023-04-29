//import uuid from 'uuid/v4';
import { v4 as uuidv4 } from 'uuid';
uuidv4(); 
export interface ICart {
    id: string;
    customerId: string;
    items: ICartItem[];
    
}

export interface ICartItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    thumbnailUr: string;
    categoryId: string;
    unitId: string;
    uom: string;
   
}

export class Cart implements ICart {
    id = uuidv4();
    customerId: string;
    items: ICartItem[] = [];
}

export interface ICartTotals {
    shipping: number;
    subtotal: number;
    total: number;
}

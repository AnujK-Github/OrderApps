
export interface IOrderToCreate {
    cartId: string;
}
export interface IInvoiceToCreate {
    orderNo: string;
}
export interface IOrder {
    id: string;
    orderNo: string;
    orderDate: string;
    orderItems: IOrderItem[];
    subtotal: number;
    total: number;
}

export interface IOrderItem {
    productItemId: string;
    productName: string;
    thumbnailUrl: string;
    price: number;
    quantity: number;
}

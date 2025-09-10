import { CartItem } from "./cart";
import { Price } from "./product";
import { Review } from "./review";


export interface ItemShipping {
    quantity: number;
    cart_item_id?: string
    product_id?: string
    variant_id?: string
}

export interface ShippingRates {
    destination_village_id?: number;
    items: ItemShipping[];
    origin_village_id?: number
}

export interface ShippingItem extends CartItem{
    product_id:string
    product_name:string
    product_price:Price
    variant_name:string
    variant_price:Price
    review?:Review
    order_id:string
    
}

export interface ResponseShippingRates {
    service: string,
    service_name: string,
    service_type: string,
    cost: Price,
    etd: string
}
import { Price, Product, Variant } from "./product";
import { Store } from "./store";

export interface CartItem {
  id: string;
  store_id:string;
  store:Store
  product_id:string;
  product:Product
  variant_id?:string
  variant?:Variant
  quantity:number
  subtotal:Price
}

export interface Cart {
    items_count:number
}

export interface UpdateCartProduct{
    variant_id:string
    quantity:number

}
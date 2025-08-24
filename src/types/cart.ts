export interface CartItem {
  id: string;
  store_id:string;
  product_id:string;
  variant_id?:string
  quantity:number
}

export interface Cart {
    items_count:number
}

export interface UpdateCartProduct{
    variant_id:string
    quantity:number

}
import { Order } from "./order"
import { Store } from "./store"

export interface Payment{
    id:string
    order_id:string
    order:Order
    store: Store & {
        qris_url:string
    }
}
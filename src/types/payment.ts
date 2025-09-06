import { Order } from "./order"
import { Store } from "./store"

export interface Payment{
    id:string
    order_id:string
    status: "pending" | "verified" | "rejected"
    sender_name: string
    paid_at:string
        created_at:string

    verified_at:string
    verified_by_name:string

    order:Order
    rejection_reason?:string
    store: Store & {
        qris_url:string
    }
}
import { Location } from "./address"
import { CartItem } from "./cart"
import { Price } from "./product"
import { ItemShipping } from "./shipping"
import { Store } from "./store"
import { User } from "./user"

export type StatusOrder = 'awaiting_payment' | 'processing' | 'paid' | 'shipped' | 'completed' | 'delivered' | 'cancelled' | 'refunded'
export type StatusPayment = 'unpaid' | 'pending' | 'uploaded' | 'verified' | 'rejected' | 'expired' | 'refunded'

export interface Order {
    order_number: string
    id: string
    customer_id: string
    customer: User
    payment_status: StatusPayment
    payment_status_label: string
    shipping_village: Location
    shipping_regency: Location
    shipping_district: Location
    shipping_province: Location
    shipping_address_line: string
    shipping_postal_code: string
    status: StatusOrder
    stats_label: string
    shipping_cost: Price
    subtotal: Price
    store_id: string
    store: Store & {
        qris_url: string
    }
    items: CartItem[]
    status_label: string
    shipping_recipient_name: string
    shipping_recipient_phone_number: string
    total_weight: number
    note?: string
    created_at: string
    total: Price


}
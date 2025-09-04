import { Location } from "./address"
import { Payment } from "./payment"
import { Price } from "./product"
import { ShippingItem } from "./shipping"
import { Store } from "./store"
import { User } from "./user"

export type StatusOrder = 'awaiting_payment' | 'processing' | 'expired'| 'paid' | 'shipped' | 'completed' | 'delivered' | 'cancelled' | 'refunded' | 'pending'
export type StatusPayment = 'unpaid' | 'pending' | 'paid' | 'uploaded' | 'verified' | 'rejected' | 'expired' | 'refunded'

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
    payment_due_at:string
    shipping_service:string
    payment:Payment
    shipping_service_type:string
    estimated_delivery:string
    tracking_number:string
    cancellation_reason?:string
    delivered_at:string
    cancelled_at:string
    paid_at:string
    expired_at:string
    shipped_at:string
    status: StatusOrder
    stats_label: string
    shipping_cost: Price
    shipping_note?: string
    subtotal: Price
    can_be_reviewed: boolean
    store_id: string
    store: Store & {
        qris_url: string
    }
    items: ShippingItem[]
    status_label: string
    shipping_recipient_name: string
    shipping_recipient_phone_number: string
    total_weight: number
    note?: string
    created_at: string
    total: Price


}
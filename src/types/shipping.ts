import { Price } from "./product";


export interface ItemShipping {
    quantity?: number;
    cart_item_id: string
    product_id?: string
    variant_id?: string
}

export interface ShippingRates {
    destination_village_id?: number;
    items: ItemShipping[];
    origin_village_id?: number
}

export interface ResponseShippingRates {
    service: string,
    service_name: string,
    service_type: string,
    cost: Price,
    etd: string
}
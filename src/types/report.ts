import { User } from "./user"

export type ReportType = "payment" | "order"

export type StatusReport = "pending" |'in_progress' | 'resolved' | 'closed';


export interface MessageReport{
    id:string
    complaint:User
    sender_id:string
    sender:User
    message:string
    created_at:string
    updated_at:string
    complaint_id:string
}

export interface Report{
    id:string
    reporter_id:string
    reporter:User
    category: ReportType
    ticket_number:string
    title:string
    description:string
    status: StatusReport
    media: {
        id:string
        media_url:string
        media_type:string
        name:string

    }[]
    created_at: string
    updated_at:string
    messages: MessageReport
}
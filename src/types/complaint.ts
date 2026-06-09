import { User } from "./user"

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected' | 'closed'

export type ComplaintCategory = 'payment' | 'product' | 'shipping' | 'account' | 'app' | 'other'

export interface ComplaintMedia {
  id: string
  complaint_id: string
  media_path: string
  media_url: string
  name: string
  created_at: string
}

export interface ComplaintMessage {
  id: string
  complaint_id: string
  sender_id: string
  sender: User
  message: string
  created_at: string
}

export interface Complaint {
  id: string
  reporter_id: string
  reporter?: User
  category: ComplaintCategory
  ticket_number: string
  title: string
  description: string
  status: ComplaintStatus
  order_id?: string
  desired_action?: string
  media?: ComplaintMedia[]
  messages?: ComplaintMessage[]
  created_at: string
  updated_at: string
}

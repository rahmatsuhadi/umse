export type StatusPublish = 'draft' | 'published' | 'archived';

export type CategoryArticle = "literasi" | "exhibition" | "training"

export interface Article {
    id: string
    title: string
    description: string
    slug: string
    content: string
    status: StatusPublish
    category: CategoryArticle
    created_at: Date
    updated_at: Date
}

export interface ArticleTraining extends Article {
    date: string
    location: string
}
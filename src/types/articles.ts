export type StatusPublish = 'draft' | 'published' | 'archived';

export type CategoryArticle = 'literature' | 'training' | 'exhibition' | 'announcement'


export interface MetaData{
    location:string
}

export interface Article {
    id: string
    title: string
    excerpt: string
    slug: string
    content: string
    status: StatusPublish
    category: CategoryArticle
    category_label:string 
    created_at: string
    updated_at: string
    metadata: MetaData | null
    thumbnail:{
        media_path: string
        media_url:string
        media_type: "image"
        id:string
        article_id:string
    }
}

export interface ArticleTraining extends Article {
    date: string
    location: string
}
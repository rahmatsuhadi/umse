import { Media, Review, Store } from "@/types";
import { formatDate } from "@/lib/format-date";
import Image from "next/image";

interface ProductReviewCardProps {
    review: Review;
    store: Store;
    handlePreviewClick: (mediaUrl: string, type: 'image' | 'video') => void;
}

export default function ProductReviewCard({ review, store, handlePreviewClick }: ProductReviewCardProps) {

    return (
        <div className="review-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {/* Avatar */}
                <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--cream-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: 'var(--terracotta)',
                    flexShrink: 0,
                    overflow: 'hidden',
                }}>
                    {review.reviewer.profile_url ? (
                        <Image
                            src={review.reviewer.profile_url}
                            alt={review.reviewer.name}
                            width={42}
                            height={42}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span style={{ fontSize: '20px' }}>👤</span>
                    )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', marginBottom: '2px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                            {review.reviewer.name}
                        </h4>
                        <div style={{ marginLeft: 'auto' }}>
                            <span className="badge badge-forest" style={{ fontSize: '10px', padding: '2px 8px' }}>Verified</span>
                        </div>
                    </div>

                    {/* Star rating & Date Group */}
                    <div style={{ marginBottom: '8px' }}>
                        {/* <div style={{ color: 'var(--saffron)', fontSize: '14px', lineHeight: 1 }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div> */}
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            📅 {formatDate(review.created_at)}
                        </div>
                    </div>

                    {/* Review text */}
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '8px' }}>
                        {review.content}
                    </p>

                    {/* Media */}
                    {review.media && review.media.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            {review.media.map((media, index) => (
                                <ReviewMedia key={index} handlePreviewClick={handlePreviewClick} media={media} />
                            ))}
                        </div>
                    )}

                    {/* Seller reply */}
                    {review.reply_content && (
                        <ReplyStore reply_content={review.reply_content || ''} seller={store.name} replied_at={review.replied_at} />
                    )}
                </div>
            </div>
        </div>
    );
}


interface ReviewMediaProps {
    media: Media;
    handlePreviewClick: (mediaUrl: string, type: 'image' | 'video') => void;
}

const ReviewMedia = ({ media, handlePreviewClick }: ReviewMediaProps) => {
    const mediaItem = media.media_url;
    const isVideo = mediaItem.endsWith('.mp4');
    const isImage = mediaItem.endsWith('.jpg') || mediaItem.endsWith('.png') || mediaItem.endsWith('.jpeg');

    if (!isVideo && !isImage) return null;

    return (
        <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
            {isVideo ? (
                <video
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onClick={() => handlePreviewClick(mediaItem, 'video')}
                >
                    <source src={mediaItem} type="video/mp4" />
                </video>
            ) : (
                <Image
                    src={mediaItem}
                    width={80}
                    height={80}
                    alt={`Review media ${media.id}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onClick={() => handlePreviewClick(mediaItem, 'image')}
                />
            )}
            {isVideo && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                    <span style={{ color: 'white', fontSize: '24px' }}>▶</span>
                </div>
            )}
        </div>
    );
};

interface ReplyStoreProps {
    seller: string;
    reply_content: string;
    replied_at?: string;
}

const ReplyStore = ({ reply_content, seller, replied_at }: ReplyStoreProps) => {
    return (
        <div style={{
            background: 'rgba(247, 98, 10, 0.06)',
            borderLeft: '3px solid var(--terracotta)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            padding: '10px 14px',
            marginTop: '8px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--terracotta)' }}>🏪 {seller}</span>
                <span style={{ background: 'var(--terracotta)', color: 'white', fontSize: '10px', padding: '2px 7px', borderRadius: '50px', fontWeight: 700 }}>Penjual</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{reply_content}</p>
            {replied_at && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{formatDate(replied_at)}</span>
            )}
        </div>
    );
};
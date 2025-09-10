import { Media, Review, Store } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/initial-getter";
import { StarRating } from "./ProductStarRating";
import { formatDate } from "@/lib/format-date";
import Image from "next/image";


interface ProductReviewCardProps {
    review: Review;
    store: Store;
    handlePreviewClick: (mediaUrl: string, type: 'image' | 'video') => void;
}

export default function ProductReviewCard({ review, store, handlePreviewClick }: ProductReviewCardProps) {
    return (
        <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start mb-4">
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 mb-2 border-4 border-gray-200 mr-3 sm:mr-4 ">
                    <AvatarImage
                        src={review.reviewer.profile_url}
                        alt="Profile"
                        className="object-cover w-full h-full"
                    />
                    <AvatarFallback>
                        {getInitials(review.reviewer.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm sm:text-base">{review.reviewer.name}</h4>
                            <div className="flex items-center text-yellow-400 mb-1"><StarRating rating={review.rating} size="xs" /></div>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">{formatDate(review.created_at)}</span>
                    </div>
                    <p className="text-gray-700 mb-3 text-sm sm:text-base">{review.content}</p>

                    {/* Render Media */}
                    {review.media && review.media.length > 0 && (
                        <div className="flex flex-wrap gap-4 mb-4">
                            {review.media.map((media, index) => {
                                return <ReviewMedia key={index} handlePreviewClick={handlePreviewClick} media={media}  />
                            })}
                        </div>
                    )}

                    {/* Balasan Penjual */}
                    {review.reply_content && (
                        <ReplyStore reply_content={review.reply_content || ''} seller={store.name} replied_at={review.replied_at} />
                    )}
                </div>
            </div>
        </div>
    )
}


interface ReviewMediaProps{
    media:Media
    handlePreviewClick: (mediaUrl: string, type: 'image' | 'video') => void;
}

const ReviewMedia = ({media,handlePreviewClick}:ReviewMediaProps) => {
    const mediaItem = media.media_url;
    // Tentukan tipe media berdasarkan ekstensi
    const isVideo = mediaItem.endsWith('.mp4');
    const isImage = mediaItem.endsWith('.jpg') || mediaItem.endsWith('.png') || mediaItem.endsWith('.jpeg');

    if (!isVideo && !isImage) return null; // Jika bukan format yang didukung

    return (
        <div className="w-24 h-24 sm:w-32 sm:h-32 relative group">
            {isVideo ? (
                <video
                    className="w-full h-full object-cover rounded-md cursor-pointer"
                    onClick={() => handlePreviewClick(mediaItem, 'video')}
                >
                    <source src={mediaItem} type="video/mp4" />
                </video>
            ) : (
                <Image
                    src={mediaItem}
                    width={100}
                    height={100}
                    alt={`Review media ${media.id}`}
                    className="w-full h-full object-cover rounded-md cursor-pointer"
                    onClick={() => handlePreviewClick(mediaItem, 'image')}
                />
            )}
            {/* Tambahkan ikon play untuk video sebagai indikator visual */}
            {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md pointer-events-none group-hover:bg-opacity-50 transition-opacity">
                    <i className="fas fa-play text-white text-3xl"></i>
                </div>
            )}
        </div>
    );
}

interface ReplyStoreProps {
    seller: string;
    reply_content: string
    replied_at?: string
}

const ReplyStore = ({ reply_content, seller, replied_at }: ReplyStoreProps) => {
    return (
        <div className="bg-orange-50 rounded-lg p-3 sm:p-4 mt-4 ml-4 sm:ml-8">

            <div className="flex items-start">

                <div className="bg-primary rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0"><i className="fas fa-store text-white text-xs sm:text-sm"></i></div>

                <div className="flex-1 min-w-0">

                    <div className="flex flex-col sm:flex-row sm:items-center mb-2">

                        <span className="font-bold text-gray-800 text-xs sm:text-sm">{seller}</span>

                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full sm:ml-2 mt-1 sm:mt-0 self-start">Penjual</span>

                    </div>

                    <p className="text-gray-700 text-xs sm:text-sm">{reply_content}</p>
                    {replied_at && (
                        <span className="text-xs text-gray-500 mt-2 block">{formatDate(replied_at)}</span>
                    )}

                </div>

            </div>

        </div>
    )
}
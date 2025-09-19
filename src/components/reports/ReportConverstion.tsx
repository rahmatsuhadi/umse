import { useUser } from "@/features/auth/hooks"
import { useAddMesage, useInfiniteMessageReport } from "@/features/reports/hook"
import { formatDate } from "@/lib/format-date"
import { MessageReport, StatusReport } from "@/types"
import { Loader, Loader2, MessageSquare } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { Card } from "../ui/card"

interface Props {
    reportId: string
    status: StatusReport
}

export default function ReportConversation({ reportId, status }: Props) {

    const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } = useInfiniteMessageReport(reportId, {
        // sort: "created_at",
        per_page: 10
    })

    const messages = data?.pages.flatMap(page => page.data) ?? [];

    const { data: userData } = useUser()

    const user = userData?.data


    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Percakapan</h2>

            <div className="space-y-6 max-h-80 overflow-y-auto pr-2">
                {hasNextPage && (
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="px-4 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                        >
                            {isFetchingNextPage ? "Memuat..." : "Muat lebih banyak"}
                        </button>
                    </div>
                )}

                {
                    isLoading ? [1, 2].map((i) => (
                        <CardMessageSkeleton key={i} />
                    )) : messages.map((message, i) => (
                        <CardMessage
                            key={i}
                            isUser={user?.id == message.sender_id}
                            message={message}
                        />
                    ))
                }

                {!isLoading && messages.length === 0 && (
                    <Card className="p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2">
                            <MessageSquare className="w-6 h-6 text-gray-500" />
                            Percakapan belum dimulai
                        </h2>
                        <p className="text-sm text-gray-500">
                            Belum ada pesan pada laporan ini. Mulailah percakapan pertama Anda.
                        </p>
                    </Card>
                )}
            </div>

            {/* <!-- Reply Form --> */}

            {status == "in_progress" || status == "pending" && (
                <ReplyForm reportId={reportId} />
            )}


        </div>
    )
}

interface CardMessageProps {
    message: MessageReport
    isUser: boolean
}
const CardMessage = ({ message, isUser }: CardMessageProps) => {


    return (
        <div className="flex space-x-4">
            <div className="flex-shrink-0">
                <div
                    className={`w-10 h-10 ${isUser ? "bg-blue-100" : "bg-primary "} rounded-full flex items-center justify-center`}
                >

                    {isUser ? (

                        <i className="fas fa-user text-blue-600"></i>
                    ) : (
                        <i className="fas fa-headset text-white"></i>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-800"
                    >{message.sender.name} {!isUser ? "(Tim Support)" : "(Anda)"}</span >
                    <span className="text-sm text-gray-500"
                    >{formatDate(message.created_at)}</span>
                </div>
                <div className={`${!isUser ? "bg-gray-50" : " bg-blue-50 "} rounded-lg p-4`}>
                    <p className="text-gray-700">
                        {message.message}
                    </p>
                </div>
            </div>
        </div>
    )
}

export function ReportConversationSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            {/* Title */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>

            {/* Messages */}
            <div className="space-y-6">
                {[1, 2].map((i) => (
                    <CardMessageSkeleton key={i} />
                ))}
            </div>

            {/* Reply form */}
            <ReplyFormSkeleton />
        </div>
    );
}


const ReplyForm = ({ reportId }: { reportId: string }) => {
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const { mutateAsync, mutate, isPending } = useAddMesage(reportId)

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setMessage("")
        mutate({ message: message })
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Balas Pesan
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <textarea
                    disabled={isPending}
                    value={message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tulis balasan Anda..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                ></textarea>

                {/* File Preview */}
                {files.length > 0 && (
                    <div className="space-y-1 text-sm text-gray-600">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <i className="fas fa-file text-gray-500"></i>
                                <span>{file.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center space-x-4">
                    <button
                        disabled={!message.trim()}
                        type="submit"
                        className="px-6 py-2 flex items-center bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {
                            isPending ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Mengirim Balasan
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane mr-2"></i>
                                    Kirim Balasan
                                </>

                            )
                        }
                    </button>
                    {/* <label className="flex items-center text-gray-700 cursor-pointer">
                        <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <i className="fas fa-paperclip mr-2 text-gray-500"></i>
                        Lampirkan File
                    </label> */}
                </div>
            </form>
        </div>
    );
};


function CardMessageSkeleton() {
    return (
        <div className="flex space-x-4">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

            {/* Message content */}
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="rounded-lg bg-gray-100 p-4">
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        </div>
    );
}

function ReplyFormSkeleton() {
    return (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="h-5 w-28 bg-gray-200 rounded mb-4"></div>

            {/* Textarea */}
            <div className="h-24 w-full bg-gray-200 rounded mb-4"></div>

            {/* Buttons */}
            <div className="flex items-center space-x-4">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
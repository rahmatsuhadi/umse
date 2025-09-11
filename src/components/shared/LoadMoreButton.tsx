
interface LoadMoreButtonProps {
    onClick: () => void;
    label?: string;
}

export default function LoadMoreButton({ onClick, label = "Lihat Selengkapnya" }: LoadMoreButtonProps) {
    return (
        <button onClick={onClick} type="button" className="bg-primary hover:cursor-pointer  text-white px-10 py-3 rounded-full font-medium hover:bg-primary-dark transition duration-300">
            {label}
        </button>
    )
}
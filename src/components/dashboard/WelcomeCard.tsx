
interface CardWelcomeProps {
    name: string
}

export default function CardWelcome({ name = "John Doe" }: CardWelcomeProps) {
    return (
        <div
            className="bg-gradient-to-r from-primary to-primary-light text-white rounded-lg p-6 mb-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Selamat Datang, {name}!</h1>
                    <p className="text-white">
                        Nikmati pengalaman belanja UMKM terbaik di Sleman
                    </p>
                </div>
                <div className="hidden md:block">
                    <i className="fas fa-user-circle text-6xl text-primary-light"></i>
                </div>
            </div>
        </div>
    )
}
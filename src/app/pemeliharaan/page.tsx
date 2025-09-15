import Image from "next/image";


export default function MaintancePage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{
            background: "linear-gradient( 135deg, #fef7f0 0%,#fff5f0 50%, #fef7f0 100%)"
        }}>
            <div className="max-w-lg w-full text-center">
                {/* <!-- Logo --> */}
                <div className="mb-4">
                    <div
                        className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full shadow-lg mb-4"
                    >
                        <i className="fas fa-store text-white text-2xl"></i>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Sleman Mart
                    </h1>
                </div>

                {/* <!-- Maintenance SVG --> */}
                <div className="mb-4">
                    <Image
                        width={100}
                        height={100}
                        src="/assets/maintenance.svg"
                        alt="Maintenance"
                        className="mx-auto w-100 h-100"
                    />
                </div>

                {/* <!-- Main Message --> */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        Sedang Dalam Perbaikan
                    </h1>
                    <p className="text-gray-600 text-xl mb-6 leading-relaxed">
                        Kami sedang melakukan peningkatan sistem untuk memberikan pengalaman
                        berbelanja yang lebih baik. Mohon maaf atas ketidaknyamanan ini.
                    </p>
                </div>
            </div>
        </div>
    )
}
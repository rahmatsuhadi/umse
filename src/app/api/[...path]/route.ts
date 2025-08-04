import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_API_URL = process.env.BACKEND_API_URL; // URL backend terpisah Anda

 async function handler(req: NextRequest) {

    const path = req.nextUrl.pathname.replace('/api', '');

    // Baca token dari HttpOnly cookie yang dikirim browser
    const tokenCookie = (await cookies()).get('s-token');
    const token = tokenCookie?.value;

    const headers = new Headers(req.headers);
    headers.delete('cookie'); // Hapus cookie asli agar tidak bocor ke backend
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    try {
        console.log(headers)
        const response = await fetch(`${BACKEND_API_URL}${path}`, {
            method: req.method,
            headers: headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : null,
    
            // duplex: 'half', // Required for streaming POST requests with Next.js 14
        });

        if (!response.ok) {
            // Coba baca body error dari backend
            const errorData = await response.json().catch(() => ({
                message: `Backend returned status ${response.status}`,
            }));
            console.error('Backend error:', errorData);

            // Kembalikan respons error ke frontend dengan status dan pesan asli dari backend
            return NextResponse.json(errorData, { status: response.status });
        }


        const responseData = await response.json();

        // Buat respons BARU menggunakan NextResponse.json agar bisa dibaca oleh frontend
        return NextResponse.json(responseData, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('API proxy error:', error);
        return NextResponse.json(
            { message: 'Error connecting to the backend service.' },
            { status: 500 }
        );
    }
}

// Daftarkan handler untuk semua method HTTP
export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
// // components/FacebookShareButton.tsx

// 'use client';

// import { useEffect } from 'react';

// // Mendefinisikan tipe untuk props yang diterima komponen
// interface FacebookShareButtonProps {
//   url: string; // URL yang akan dibagikan
// }

// const FacebookShareButton = ({ url }: FacebookShareButtonProps) => {
//   useEffect(() => {
//     // Fungsi untuk memuat dan menginisialisasi Facebook SDK
//     const initializeFacebookSDK = () => {
//       // Cek jika skrip SDK sudah ada, jangan muat ulang
//       if (document.getElementById('facebook-jssdk')) {
//         // Jika sudah ada, cukup parse ulang untuk merender tombol baru
//         if (window.FB) {
//           window.FB.XFBML.parse();
//         }
//         return;
//       }

//       // Definisikan fungsi yang akan dijalankan setelah SDK selesai dimuat
//       window.fbAsyncInit = function () {
//         window.FB?.init({
//           cookie: true,
//           xfbml: true,
//           version: 'v19.0' // Gunakan versi API terbaru
//         });
//       };

//       // Buat elemen <script> untuk memuat SDK
//       const script = document.createElement('script');
//       script.id = 'facebook-jssdk';
//       script.src = "https://connect.facebook.net/en_US/sdk.js";
//       script.async = true;
//       script.defer = true;
//       script.crossOrigin = 'anonymous';
//       document.body.appendChild(script);
//     };

//     initializeFacebookSDK();

//   }, [url]); // Effect ini akan berjalan setiap kali `url` prop berubah

//   return (
//     <>
//       {/* Div ini wajib ada untuk inisialisasi SDK */}
//       <div id="fb-root"></div>

//       {/* Ini adalah kode asli tombol dari Facebook */}
//       <div
//         className="fb-share-button"
//         data-href={url}
//         data-layout="button_count"
//         data-size="small"
//       >
//         <a
//           target="_blank"
//           rel="noopener noreferrer"
//           href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
//           className="fb-xfbml-parse-ignore"
//         >
//           Share
//         </a>
//       </div>
//     </>
//   );
// };

// export default FacebookShareButton;
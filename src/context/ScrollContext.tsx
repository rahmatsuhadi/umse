import React, { createContext, useContext, useRef } from "react";

// Tipe data untuk context
interface ScrollContextType {
    scrollToElement: (id: string) => void;
}

// Membuat context dengan default value
const ScrollContext = createContext<ScrollContextType | undefined>(undefined);
    
// Hook untuk mengambil context
export const useScroll = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error("useScroll must be used within a ScrollProvider");
    }
    return context;
};

// ScrollProvider untuk membungkus aplikasi dan menyediakan context
export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Menggunakan useRef untuk mendefinisikan elemen yang bisa di-scroll
    const elementsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Fungsi untuk scroll ke elemen berdasarkan ID
    const scrollToElement = (id: string) => {
        const element = elementsRef.current[id];
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <ScrollContext.Provider value={{ scrollToElement }}>
            {children}
        </ScrollContext.Provider>
    );
};

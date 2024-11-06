"use client";
import { usePathname } from 'next/navigation';
import { Footer } from './footer';

export const FooterLayout = () => {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    if(isAdminPage) {
        return null;
    }
    return (
        <>
            <Footer />
        </>
    )
}
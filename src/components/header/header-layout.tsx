"use client";
import { usePathname } from 'next/navigation';
import { Header } from "./header"

export const HeaderLayout = () => {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    if(isAdminPage) {
        return null;
    }
    return (
        <>
            <Header />
            <div className="md:mt-28 mt-14" />
        </>
    )
}
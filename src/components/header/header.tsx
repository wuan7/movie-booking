
import { Navbar } from "./navbar";

export const Header = () => {
   
    return(
        <div className={`fixed top-0 left-0 w-full bg-gradient-to-b z-50  from-[#0F172A] to-[#131d36] pb-2 `}>
            <Navbar />
        </div>
    )
}
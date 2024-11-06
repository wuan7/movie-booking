import Image from "next/image";
import Link from "next/link";
export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b border-t  from-gray-900 to-gray-800 shadow-white ">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="#"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Image alt="logo" src={"/logo.svg"} width={60} height={60} />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              Cinema
            </span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white">
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm  sm:text-center text-white">
          © 2024{" "}
          <Link href="#" className="hover:underline">
            Cinema™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const msg = new URLSearchParams(window.location.search).get("message");
    if (msg) {
      setMessage(msg);
    } else {
      setMessage("Giao dịch thành công!");
    }

    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-green-600">Thành Công</h1>
      <p className="mt-4 text-lg">{message}</p>
      <p className="mt-2 text-gray-500">
        Bạn sẽ được điều hướng về trang chính trong vài giây...
      </p>
    </div>
  );
};

export default SuccessPage;

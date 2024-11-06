"use client"
import React, { useState, FormEvent } from 'react';
import axios from 'axios';

const Order: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [bankCode, setBankCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('vn');

  const createPaymentUrl = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ url: string }>('/api/vnpay/create-payment-url', {
        amount,
        bankCode,
        language,
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      alert('Lỗi khi tạo URL thanh toán');
    }
  };

  return (
    <div>
      <h1>Tạo mới đơn hàng</h1>
      <form onSubmit={createPaymentUrl}>
        <div>
          <label>Số tiền:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Ngân hàng:</label>
          <input
            type="text"
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
          />
        </div>
        <div>
          <label>Ngôn ngữ:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="vn">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
        <button className='bg-blue-500 text-white' type="submit">Thanh toán</button>
      </form>
    </div>
  );
};

export default Order;

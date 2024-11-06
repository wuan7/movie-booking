import { NextRequest, NextResponse } from "next/server";
import { Id } from "../../../../../convex/_generated/dataModel";
import moment from "moment";
import qs from "qs";
import crypto from "crypto";

interface CreatePaymentBody {
  amount: number;
  bankCode?: string;
  language?: string;
  bookingId: Id<"bookings">;
}

// Hàm để sắp xếp các tham số theo thứ tự ABC
const sortObject = (
  obj: Record<string, string | number>
): Record<string, string> => {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, string>, key: string) => {
      result[key] = encodeURIComponent(String(obj[key])).replace(/%20/g, "+");
      return result;
    }, {});
};

export async function POST(req: NextRequest) {
  try {
    const body: CreatePaymentBody = await req.json();
    const { amount, bankCode, language = "vn", bookingId } = body;

    if (amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    if (!bookingId) {
      return NextResponse.json(
        { message: "Invalid bookingId" },
        { status: 400 }
      );
    }

    const tmnCode = process.env.VNP_TMNCODE as string;
    const secretKey = process.env.VNP_HASHSECRET as string;
    const vnpUrl = process.env.VNP_URL as string;
    const returnUrl = process.env.VNP_RETURNURL as string;

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const orderId = moment(date).format("DDHHmmss");
    const xForwardedFor = req.headers.get("x-forwarded-for");
    const ipAddr = xForwardedFor
      ? xForwardedFor.split(",")[0].trim()
      : "0.0.0.0";

    let vnp_Params: Record<string, string | number> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: language,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: bookingId,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    console.error("Error in create_payment_url:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

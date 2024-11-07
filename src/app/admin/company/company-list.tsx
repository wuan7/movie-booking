import { useGetCompanies } from "@/features/companies/api/use-get-companies";
import { Loader, TriangleAlert } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export const CompanyList = () => {
  const { data, isLoading } = useGetCompanies();
  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Không tìm thấy dữ liệu
        </span>
      </div>
    );
  }
  return (
    <div>
      <div className="min-h-96">
        <h1 className="font-bold text-xl p-2">Danh sách company</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh background</TableHead>
              <TableHead>Ảnh logo</TableHead>
              <TableHead>Tên company</TableHead>
              <TableHead>Số cửa hàng</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((company) => {
              const date = company._creationTime
                ? new Date(company._creationTime)
                : null;
              const formattedDate = date
                ? date.toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "N/A";
              return (
                <TableRow key={company._id}>
                  <TableCell>
                    <div className="w-24 h-24 relative">
                      <Image
                        alt=""
                        src={company.logoUrl || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24 h-24 relative">
                      <Image
                        alt=""
                        src={company.posterUrl || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell className="font-medium">
                    {company.storesNumber}
                  </TableCell>
                  <TableCell className="font-medium">
                    {company.description}
                  </TableCell>
                  <TableCell>{formattedDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

import { useCreateBranchModal } from "../store/use-create-branch-model";
import { useCreateBranch } from "../api/use-create-branch";
import { useGetCompanies } from "@/features/companies/api/use-get-companies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown, TriangleAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";

type CreateBranchValues = {
  cinemaCompanyId: Id<"cinemaCompanies">;
  name: string;
  location: string;
  address: string;
  contactNumber?: string;
};
const vietnamProvinces = [
  { value: "an_giang", label: "An Giang" },
  { value: "ba_ria_vung_tau", label: "Bà Rịa - Vũng Tàu" },
  { value: "bac_giang", label: "Bắc Giang" },
  { value: "bac_kan", label: "Bắc Kạn" },
  { value: "bac_lieu", label: "Bạc Liêu" },
  { value: "bac_ninh", label: "Bắc Ninh" },
  { value: "ben_tre", label: "Bến Tre" },
  { value: "binh_dinh", label: "Bình Định" },
  { value: "binh_duong", label: "Bình Dương" },
  { value: "binh_phuoc", label: "Bình Phước" },
  { value: "binh_thuan", label: "Bình Thuận" },
  { value: "ca_mau", label: "Cà Mau" },
  { value: "can_tho", label: "Cần Thơ" },
  { value: "cao_bang", label: "Cao Bằng" },
  { value: "da_nang", label: "Đà Nẵng" },
  { value: "dak_lak", label: "Đắk Lắk" },
  { value: "dak_nong", label: "Đắk Nông" },
  { value: "dien_bien", label: "Điện Biên" },
  { value: "dong_nai", label: "Đồng Nai" },
  { value: "dong_thap", label: "Đồng Tháp" },
  { value: "gia_lai", label: "Gia Lai" },
  { value: "ha_giang", label: "Hà Giang" },
  { value: "ha_nam", label: "Hà Nam" },
  { value: "ha_noi", label: "Hà Nội" },
  { value: "ha_tinh", label: "Hà Tĩnh" },
  { value: "hai_duong", label: "Hải Dương" },
  { value: "hai_phong", label: "Hải Phòng" },
  { value: "hau_giang", label: "Hậu Giang" },
  { value: "hoa_binh", label: "Hòa Bình" },
  { value: "hung_yen", label: "Hưng Yên" },
  { value: "khanh_hoa", label: "Khánh Hòa" },
  { value: "kien_giang", label: "Kiên Giang" },
  { value: "kon_tum", label: "Kon Tum" },
  { value: "lai_chau", label: "Lai Châu" },
  { value: "lam_dong", label: "Lâm Đồng" },
  { value: "lang_son", label: "Lạng Sơn" },
  { value: "lao_cai", label: "Lào Cai" },
  { value: "long_an", label: "Long An" },
  { value: "nam_dinh", label: "Nam Định" },
  { value: "nghe_an", label: "Nghệ An" },
  { value: "ninh_binh", label: "Ninh Bình" },
  { value: "ninh_thuan", label: "Ninh Thuận" },
  { value: "phu_tho", label: "Phú Thọ" },
  { value: "phu_yen", label: "Phú Yên" },
  { value: "quang_binh", label: "Quảng Bình" },
  { value: "quang_nam", label: "Quảng Nam" },
  { value: "quang_ngai", label: "Quảng Ngãi" },
  { value: "quang_ninh", label: "Quảng Ninh" },
  { value: "quang_tri", label: "Quảng Trị" },
  { value: "soc_trang", label: "Sóc Trăng" },
  { value: "son_la", label: "Sơn La" },
  { value: "tay_ninh", label: "Tây Ninh" },
  { value: "thai_binh", label: "Thái Bình" },
  { value: "thai_nguyen", label: "Thái Nguyên" },
  { value: "thanh_hoa", label: "Thanh Hóa" },
  { value: "thua_thien_hue", label: "Thừa Thiên Huế" },
  { value: "tien_giang", label: "Tiền Giang" },
  { value: "tp_ho_chi_minh", label: "TP Hồ Chí Minh" },
  { value: "tra_vinh", label: "Trà Vinh" },
  { value: "tuyen_quang", label: "Tuyên Quang" },
  { value: "vinh_long", label: "Vĩnh Long" },
  { value: "vinh_phuc", label: "Vĩnh Phúc" },
  { value: "yen_bai", label: "Yên Bái" },
];

export const CreateBranchModal = () => {
  const [open, setOpen] = useCreateBranchModal();
  const [provOpen, setProvOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [isPending, setIsPending] = useState(false);
  const { mutate } = useCreateBranch();
  const { data: companies, isLoading: companiesLoading } = useGetCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<Id<"cinemaCompanies">>();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const handleClose = () => {
    setOpen(false);
    setName("");
    setAddress("");
    setContactNumber("");
    setProvinceName("")
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsPending(true);
      const values: CreateBranchValues = {
        cinemaCompanyId: selectedCompanyId as Id<"cinemaCompanies">,
        name,
        location: provinceName,
        address,
        contactNumber,
      };

      mutate(values, {
        onSuccess: () => {
          toast.success("Branch created successfully");
          // handleClose();
        },
        onError: (error) => {
          toast.error("Failed to create Branch");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create Branch");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-y-auto max-h-[80vh] p-6">
        <DialogHeader>
          <DialogTitle>Add a Branch</DialogTitle>
        </DialogHeader>
        <div>
          <Select
            onValueChange={(value :  Id<"cinemaCompanies">) => setSelectedCompanyId(value)}
            required
            disabled={isPending}
          >
            <SelectTrigger className="md:w-[380px] w-full">
              <SelectValue placeholder="Select cinema chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companiesLoading ? (
                  <>
                    <div className="flex flex-col gap-y-2 ">
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : !companies ? (
                  <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                    <TriangleAlert className="size-6  text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      No cinema-chain found
                    </span>
                  </div>
                ) : (
                  <>
                    {companies.map((company) => (
                      <SelectItem
                        key={company._id}
                        value={company._id}
                        className={`${selectedCompanyId === company._id ? "bg-blue-400" : ""}`}
                      >
                        <div className="flex items-center">
                          <Avatar className="size-10 hover:opacity-75 transition mr-2">
                            <AvatarImage src={company.logoUrl || ""} />
                            <AvatarFallback>
                              {company.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-semibold">{company.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Popover open={provOpen} onOpenChange={setProvOpen} >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={provOpen}
                className="w-[200px] justify-between font-normal mt-2"
              >
                {selectedProvince
                  ? vietnamProvinces.find(
                      (prov) => prov.label === selectedProvince
                    )?.label
                  : "Select location..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search location..."
                  value={searchTerm}
                  onValueChange={(value) => setSearchTerm(value)}
                />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    {vietnamProvinces.map((prov) => (
                      <CommandItem
                        key={prov.value}
                        value={prov.label}
                        onSelect={(currentValue: string) => {
                          setSelectedProvince(currentValue);
                          setProvinceName(prov.value)
                          setProvOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProvince === prov.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {prov.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Branch name"
          />
          <Textarea
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            placeholder="Address..."
            disabled={isPending}
          />

          <Input
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            disabled={isPending}
            autoFocus
            minLength={5}
            placeholder="09999..."
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

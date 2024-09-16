import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CreateWarehouseForm, { FormValues } from "./create-warehouse-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWarehouse } from "@/http/api";
import { useNewWarehouse } from "@/store/warehouse/warehouse-store";
import { useToast } from "@/hooks/use-toast";
import { Warehouse } from "@/types";
const WarehouseSheet = () => {
  const { isOpen, onClose } = useNewWarehouse();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  //uploading data from frontend side
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-warehouse"],
    mutationFn: (data: Warehouse) => createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast({
        title: "Warehouse created successfully",
      });
      onClose();
    },
  });
  const onSubmit = (values: FormValues) => {
    mutate(values as Warehouse);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[28rem] space-y-4 bg-white">
        <SheetHeader>
          <SheetTitle>Create Warehouse</SheetTitle>
          <SheetDescription>Create a new warehouse</SheetDescription>
        </SheetHeader>
        <CreateWarehouseForm onSubmit={onSubmit} disabled={isPending} />
      </SheetContent>
    </Sheet>
  );
};

export default WarehouseSheet;

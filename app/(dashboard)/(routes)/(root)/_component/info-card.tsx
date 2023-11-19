import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";
import React from "react";

interface InfoCardProps {
  variant?: "default" | "success";
  numberOfItems: number;
  label: string;
  icon: LucideIcon;
}
export const InfoCard = ({
  variant,
  icon: Icon,
  label,
  numberOfItems,
}: InfoCardProps) => {
  return (
    <div className="flex items-center p-3 border rounded-md gap-x-2">
      <IconBadge variant={variant} icon={Icon} />
      <div className="">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};

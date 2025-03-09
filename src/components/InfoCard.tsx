import React from "react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export default function InfoCard({
  icon,
  title,
  value,
  unit,
  className = "",
}: InfoCardProps) {
  return (
    <div
      className={cn(
        "px-6 py-6 my-1 shadow-lg rounded-2xl bg-white border border-gray-200",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="bg-black rounded-xl p-2 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-400 mb-1">{title}</h1>
          <p className="text-3xl font-extrabold">
            {value}{" "}
            {unit && <span className="text-xl text-gray-600">{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

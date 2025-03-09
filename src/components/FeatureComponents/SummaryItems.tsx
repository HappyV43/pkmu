import { cn } from "@/lib/utils";
import React from "react";

type SummaryItemsProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
    additionalInfo?: string;
    cs?: string;
};

const SummaryItems: React.FC<SummaryItemsProps> = ({ icon, title, value, additionalInfo, cs }) => {
    return (
        <div className="rounded-lg p-4 mb-4">
            <div className="flex items-start gap-4">
                <div className={cn(
                        "flex items-center justify-center bg-black rounded-xl p-2",
                        cs
                    )}
                >
                    {icon}
                </div>
                <div>
                    <h1 className="text-sm font-semibold text-gray-400 mb-1">{title}</h1>
                    <p className="text-3xl font-extrabold">
                        {value}{" "}
                        {additionalInfo && <span className="text-xl text-gray-600"> {additionalInfo} </span> }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SummaryItems;

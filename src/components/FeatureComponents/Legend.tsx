import { cn } from "@/lib/utils";

interface LegendProps {
    data: { agentName: string; fill: string; qty: number }[]; // Update the type based on pieData structure
}

export const Legend = ({ data }: LegendProps) => {
    return (
        <div className="flex flex-col space-y-2">
            {data.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                              "h-2.5 w-2.5"
                          )}
                          style={
                            {
                              "--color-bg": entry.fill,
                              "--color-border": entry.fill,
                            } as React.CSSProperties
                          }
                        />
                    <span className="text-xs font-medium">{entry.agentName}</span> {/* Display agent name */}
                </div>
            ))}
        </div>
    );
};
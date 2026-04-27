import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

const FaqAccordion = ({ items }: { items: FaqItem[] }) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="py-1">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-4 px-5 text-left rounded-xl hover:bg-accent transition-colors duration-200 group"
            >
              <span
                className={cn(
                  "font-semibold pr-4 transition-colors group-hover:text-primary",
                  isOpen ? "text-primary" : "text-foreground"
                )}
              >
                {item.question}
              </span>
              <span
                className={cn(
                  "flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full border-2 transition-all duration-300",
                  isOpen ? "bg-primary border-primary rotate-45" : "border-border"
                )}
              >
                <Plus
                  className={cn(
                    "w-3 h-3 transition-colors",
                    isOpen ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                  strokeWidth={3}
                />
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 animate-fade-in">
                <p className="text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;

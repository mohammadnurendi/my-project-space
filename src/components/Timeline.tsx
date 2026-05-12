import { cn } from "@/lib/utils";

export interface TimelineItem {
  period: string;
  title: string;
  description: string;
  active?: boolean;
}

const Timeline = ({ items }: { items: TimelineItem[] }) => {
  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-border z-0" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative"
          >
            {/* Dot */}
            <div className="hidden lg:flex justify-center mb-6">
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-4",
                  item.active
                    ? "bg-primary border-primary"
                    : "bg-background border-border"
                )}
              />
            </div>

            <div className="bg-card rounded-xl p-6 border border-border relative overflow-hidden">
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-1",
                  item.active ? "bg-primary" : "bg-border"
                )}
              />

              <div className="pt-2">
                <div className="inline-flex items-center gap-2 bg-muted rounded-md px-3 py-1 mb-4">
                  <span className="text-primary font-bold text-xs">{item.period}</span>
                </div>

                <h3 className="font-bold text-foreground text-base leading-snug mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;

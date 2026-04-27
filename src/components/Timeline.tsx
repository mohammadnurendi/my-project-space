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
      <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 z-0" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {items.map((item, i) => (
          <div
            key={i}
            className="group relative animate-fade-up"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {/* Dot */}
            <div className="hidden lg:flex justify-center mb-6">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-4 transition-all duration-300 group-hover:scale-125",
                  item.active
                    ? "bg-primary border-primary shadow-lg shadow-primary/40"
                    : "bg-background border-primary"
                )}
              />
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-colors duration-300",
                  item.active ? "bg-primary" : "bg-border group-hover:bg-primary/50"
                )}
              />

              <div className="pt-2">
                <div className="inline-flex items-center gap-2 bg-accent border border-primary/10 rounded-full px-3 py-1 mb-4">
                  <span className="text-primary font-bold text-xs">{item.period}</span>
                  {item.active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
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

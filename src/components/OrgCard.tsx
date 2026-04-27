import { cn } from "@/lib/utils";

interface OrgCardProps {
  name: string;
  role: string;
  isHead?: boolean;
}

const OrgCard = ({ name, role, isHead = false }: OrgCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl px-5 py-4 text-center shadow-sm border transition-all duration-300 hover:shadow-md min-w-[180px] max-w-[260px]",
        isHead
          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
          : "bg-card text-foreground border-border hover:border-primary/30"
      )}
    >
      <h4
        className={cn(
          "font-bold text-sm leading-tight whitespace-pre-line",
          isHead ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {name}
      </h4>
      <p
        className={cn(
          "text-xs mt-1.5 leading-snug",
          isHead ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        {role}
      </p>
    </div>
  );
};

export default OrgCard;

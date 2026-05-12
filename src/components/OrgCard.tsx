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
        "rounded-xl px-5 py-4 text-center border min-w-[180px] max-w-[260px]",
        isHead
          ? "bg-foreground text-background border-foreground"
          : "bg-card text-foreground border-border"
      )}
    >
      <h4
        className={cn(
          "font-bold text-sm leading-tight whitespace-pre-line",
          isHead ? "text-background" : "text-foreground"
        )}
      >
        {name}
      </h4>
      <p
        className={cn(
          "text-xs mt-1.5 leading-snug",
          isHead ? "text-background/70" : "text-muted-foreground"
        )}
      >
        {role}
      </p>
    </div>
  );
};

export default OrgCard;

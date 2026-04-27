import { User } from "lucide-react";

interface TeamCardProps {
  name: string;
  role: string;
  photo?: string;
}

const TeamCard = ({ name, role, photo }: TeamCardProps) => {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-border transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden bg-gradient-to-br from-muted to-secondary aspect-square">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-background/40 flex items-center justify-center">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-foreground text-sm leading-tight">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{role}</p>
      </div>
    </div>
  );
};

export default TeamCard;

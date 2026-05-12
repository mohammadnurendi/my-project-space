import { User } from "lucide-react";

interface TeamCardProps {
  name: string;
  role: string;
  photo?: string;
}

const TeamCard = ({ name, role, photo }: TeamCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border">
      <div className="relative overflow-hidden bg-muted aspect-square">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-background/40 flex items-center justify-center">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-foreground text-sm leading-tight">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{role}</p>
      </div>
    </div>
  );
};

export default TeamCard;

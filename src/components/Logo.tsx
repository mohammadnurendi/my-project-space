import logoImg from "@/assets/logo-lpm.png";

interface LogoProps {
  className?: string;
  imgClassName?: string;
}

const Logo = ({ className = "", imgClassName = "h-9 w-auto" }: LogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img src={logoImg} alt="LPM Itenas" className={imgClassName} />
    </div>
  );
};

export default Logo;

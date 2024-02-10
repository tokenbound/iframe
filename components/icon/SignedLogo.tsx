import SignatureIcon from "../../public/signature.svg";
import Image from "next/image";

interface Props {
  className?: string;
}

export const SignedLogo = ({
  className,
  ...rest
}: Props): React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> => {
  return (
    <Image src={SignatureIcon} width={40} height={40} alt="binder signature" className="bg-white rounded-full border-0" />
  );
};

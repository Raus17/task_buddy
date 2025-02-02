import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
    onClick: () => void;
    
  }  

export default function GoogleButton({ onClick }: GoogleButtonProps) {
  return (
    <button onClick={onClick}
    className="bg-black text-white rounded-2xl w-[364px] h-[60px] flex items-center justify-center gap-2 hover:bg-gray-800 mt-4">
      <FcGoogle className="text-2xl" />
      <span className="font-semibold text-lg">Continue with Google</span>
    </button>
  );
}

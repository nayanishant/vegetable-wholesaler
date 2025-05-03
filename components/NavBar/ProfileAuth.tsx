import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface ProfileAuthProps {
  session: any;
}

const ProfileAuth = ({ session }: ProfileAuthProps) => {
  return (
    <>
      {!session ? (
        <Link href="/login">
          <Button className="bg-green-500 hover:bg-green-600">Login</Button>
        </Link>
      ) : (
        <div className="flex items-center gap-3">
          {session.user?.image && (
            <Link href="/profile">
              <Image
                src={session.user.image}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
                priority={true}
              />
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileAuth;

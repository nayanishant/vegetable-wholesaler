'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    const promptEvent = deferredPrompt as any; // typescript fix
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install');
    } else {
      console.log('User dismissed the install');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[url('/images/Hero.png')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Premium Wholesale Vegetables for Your Business
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Fresh from farm to your doorstep. Quality vegetables at wholesale prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-green-500 hover:bg-green-600">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {!session ? (
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white bg-black hover:bg-white/40 outline-none border-none"
                >
                  Login to Order
                </Button>
              </Link>
            ) : null}

            {isVisible && (
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-black hover:bg-gray-200"
                onClick={handleInstallClick}
              >
                Install App
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

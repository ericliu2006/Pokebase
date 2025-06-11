'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Camera, Home, Users, ShoppingCart, User } from 'lucide-react';
import { SignOutButton } from './auth/SignOutButton';
import { useEffect, useState } from 'react';

interface UserSession {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

export function Navigation() {
  const { data: session, status } = useSession();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const isLoggedIn = !!session?.user;

  useEffect(() => {
    if (session?.user) {
      const user = session.user as UserSession;
      setIsEmailVerified(user.emailVerified !== null);
    }
  }, [session]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="border-b">
      {isLoggedIn && !isEmailVerified && (
        <div className="bg-amber-50 text-amber-800 text-center p-2 text-sm">
          Please verify your email address. Check your inbox for the verification link.
          <button
            onClick={handleSignOut}
            className="ml-2 text-amber-600 hover:text-amber-800 font-medium"
          >
            Sign out
          </button>
        </div>
      )}
      <div className="container flex h-16 items-center px-4 mx-auto">
        <Link href="/" className="flex items-center font-bold text-xl">
          <span className="text-rose-500">Poké</span>Base
        </Link>
        <nav className="ml-auto hidden md:flex gap-6">
          <NavLinks isLoggedIn={isLoggedIn} isEmailVerified={isEmailVerified} />
        </nav>
        <div className="ml-auto md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks isLoggedIn={isLoggedIn} isEmailVerified={isEmailVerified} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

interface NavLinksProps {
  isLoggedIn: boolean;
  isEmailVerified: boolean;
}

function NavLinks({ isLoggedIn, isEmailVerified }: NavLinksProps) {
  if (isLoggedIn && isEmailVerified) {
    return (
      <>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/scan"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Camera className="w-5 h-5" />
          <span>Scan</span>
        </Link>
        <Link
          href="/friends"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Users className="w-5 h-5" />
          <span>Friends</span>
        </Link>
        <Link
          href="/marketplace"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Marketplace</span>
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
        <SignOutButton className="text-muted-foreground hover:text-foreground transition-colors" />
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        Log In
      </Link>
      <Link
        href="/signup"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        Sign Up
      </Link>
    </>
  );
}

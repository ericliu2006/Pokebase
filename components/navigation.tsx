"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Camera, Home, Users, ShoppingCart, User, LogOut } from "lucide-react"

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-rose-500">Poké</span>Collect
        </Link>
        <nav className="ml-auto hidden md:flex gap-6">
          <NavLinks isLoggedIn={isLoggedIn} />
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
                <NavLinks isLoggedIn={isLoggedIn} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function NavLinks({ isLoggedIn }) {
  if (isLoggedIn) {
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
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </>
    )
  }

  return (
    <>
      <Link
        href="/login"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        Login
      </Link>
      <Link href="/signup">
        <Button className="bg-rose-500 hover:bg-rose-600">Sign Up</Button>
      </Link>
    </>
  )
}

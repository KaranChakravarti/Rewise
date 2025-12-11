"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from './Logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About Us' },
];

export default function Navbar() {
  const pathname = usePathname();

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => (
      <Button
        key={link.href}
        variant="link"
        asChild
        className={cn(
          'text-muted-foreground transition-colors hover:text-foreground hover:no-underline',
          pathname === link.href && 'text-foreground',
          isMobile && 'w-full justify-start text-lg'
        )}
      >
        <Link href={link.href}>{link.label}</Link>
      </Button>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            {renderNavLinks()}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="mb-6 flex items-center">
                <Logo />
              </Link>
              <div className="flex flex-col gap-4">
                {renderNavLinks(true)}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center">
             <Logo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

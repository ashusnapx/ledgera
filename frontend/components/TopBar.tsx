"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { OrgSwitcher } from "./OrgSwitcher";
import { ModeToggle } from "./ModeToggle";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ================= COMPONENT ================= */

export function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full",
        "border-b bg-background/80 backdrop-blur",
        "supports-backdrop-filter:bg-background/60"
      )}
    >
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6'>
        {/* LEFT */}
        <div className='flex items-center gap-3'>
          <span className='text-2xl font-semibold tracking-tight'>Ledgera</span>

          {/* Desktop org switcher */}
          <div className='hidden sm:block'>
            <Separator orientation='vertical' className='mx-1 h-5' />
            <OrgSwitcher />
          </div>
        </div>

        {/* RIGHT — Desktop */}
        <div className='hidden sm:flex items-center gap-2'>
          <CreateProjectDialog />
          <CreateOrganizationDialog />

          <Separator orientation='vertical' className='mx-1 h-5' />

          <ModeToggle />
        </div>

        {/* RIGHT — Mobile menu button */}
        <Button
          variant='ghost'
          size='icon'
          className='sm:hidden'
          onClick={() => setOpen((v) => !v)}
          aria-label='Toggle menu'
        >
          {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </Button>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className='sm:hidden border-t bg-background'>
          <div className='space-y-3 px-4 py-4'>
            <OrgSwitcher />

            <Separator />

            <CreateProjectDialog />

            <Separator />
            <CreateOrganizationDialog />

            <Separator />

            <div className='flex justify-between items-center'>
              <span className='text-xs text-muted-foreground'>Theme</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { OrgSwitcher } from "./OrgSwitcher";
import { ModeToggle } from "./ModeToggle";

export function TopBar() {

  return (
    <header className='sticky top-0 z-20 border-b bg-background/80 backdrop-blur'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-6'>
        <h1 className='text-sm font-semibold tracking-tight'>Ledgera</h1>

        <div className='flex items-center gap-3'>
          <OrgSwitcher />
              </div>
              
              <ModeToggle/>
      </div>
    </header>
  );
}

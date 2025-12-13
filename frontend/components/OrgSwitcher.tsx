"use client";

import { useQuery } from "@apollo/client/react";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";

import { GET_ORGANIZATIONS } from "@/graphql/queries";
import { useOrg } from "@/context/OrgContext";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

/* ================= TYPES ================= */

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface GetOrganizationsData {
  organizations: Organization[];
}

/* ================= COMPONENT ================= */

export function OrgSwitcher() {
  const { orgSlug, setOrgSlug } = useOrg();
  const { data, loading } = useQuery<GetOrganizationsData>(GET_ORGANIZATIONS);

  const currentOrg = data?.organizations.find((org) => org.slug === orgSlug);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          className={cn("w-[200px] justify-between", "text-sm font-normal")}
        >
          <div className='flex items-center gap-2 truncate'>
            <Building2 className='h-4 w-4 text-muted-foreground' />
            <span className='truncate'>
              {currentOrg?.name ?? "Select organization"}
            </span>
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search organization…' />
          <CommandEmpty>No organization found.</CommandEmpty>

          <CommandGroup>
            {loading && (
              <div className='px-2 py-2 text-xs text-muted-foreground'>
                Loading…
              </div>
            )}

            {data?.organizations.map((org) => (
              <CommandItem
                key={org.id}
                value={org.slug}
                onSelect={() => setOrgSlug(org.slug)}
                className='flex items-center gap-2'
              >
                <Building2 className='h-4 w-4 text-muted-foreground' />

                <span className='flex-1 truncate'>{org.name}</span>

                {org.slug === orgSlug && (
                  <Check className='h-4 w-4 text-primary' />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

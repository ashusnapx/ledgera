"use client";

import { useQuery } from "@apollo/client/react";
import { GET_ORGANIZATIONS } from "@/graphql/queries";
import { useOrg } from "@/context/OrgContext";

export function OrgSwitcher() {
  const { orgSlug, setOrgSlug } = useOrg();
  const { data } = useQuery(GET_ORGANIZATIONS);

  return (
    <select
      value={orgSlug}
      onChange={(e) => setOrgSlug(e.target.value)}
      className='border rounded px-2 py-1 text-sm'
    >
      {data?.organizations.map((org: any) => (
        <option key={org.id} value={org.slug}>
          {org.name}
        </option>
      ))}
    </select>
  );
}

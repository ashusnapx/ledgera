"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_ORGANIZATION } from "@/graphql/mutations";
import { useOrg } from "@/context/OrgContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateOrganizationDialog() {
  const { setOrgSlug } = useOrg();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [createOrganization, { loading }] = useMutation(CREATE_ORGANIZATION, {
    refetchQueries: ["GetOrganizations"],
      onCompleted: (data) => {
      const slug = data?.createOrganization?.organization?.slug;
      if (slug) {
        setOrgSlug(slug); // auto switch
      }
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' variant='secondary'>
          + New Organization
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
        </DialogHeader>

        <form
          className='space-y-3'
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.trim()) return;

            createOrganization({
              variables: {
                name,
                contactEmail: email,
              },
            });

            setName("");
            setEmail("");
          }}
        >
          <Input
            placeholder='Organization name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type='email'
            placeholder='Contact email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className='flex justify-end'>
            <Button type='submit' disabled={loading}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

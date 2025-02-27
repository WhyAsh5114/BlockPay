"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Contact } from "@prisma/client";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function ContactList({
  contacts: _contacts,
}: {
  contacts: Contact[];
}) {
  const { address } = useAccount();
  const contacts = _contacts.filter((contact) => contact.contactOf === address);

  return (
    <div className="space-y-4">
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <Card
              key={`${contact.contactOf}-${contact.contactWith}`}
              className="p-4 bg-secondary"
            >
              <CardContent className="flex items-center gap-4 p-0">
                <Avatar>
                  <AvatarFallback className="bg-background">
                    {contact.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{contact.name}</h3>
                  <p className="text-sm text-gray-500 truncate w-48">
                    {contact.contactWith}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No contacts found.</p>
      )}
      <div className="flex justify-center">
        <Button variant="default">
          <Link href="/contacts/create">Create Contact</Link>
        </Button>
      </div>
    </div>
  );
}

import prisma from "@/lib/prisma";
import ContactList from "./contact-list";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany();
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Contacts</h1>
      <ContactList contacts={contacts} />
    </>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { CreateContactAction } from "@/app/actions/create-contact";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { redirect } from "next/navigation";

const contactFormSchema = z.object({
  contactWith: z.string().min(1, "Contact Address is required"),
  name: z.string().min(1, "Contact name is required"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: Partial<ContactFormValues> = { contactWith: "", name: "" };

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentContacts, setRecentContacts] = useState<ContactFormValues[]>([]);
  const { address } = useAccount();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  async function createContact(contact: FormData) {
    const response = CreateContactAction(contact);
    return response;
  }

  async function onSubmit() {
    const formData = new FormData();
    formData.append("contactWith", form.getValues("contactWith"));
    formData.append("name", form.getValues("name"));
    if (!address) {
      return toast.error("Connect wallet to add contact");
    }
    formData.append("contactOf", address!);

    setIsSubmitting(true);
    const response = await createContact(formData);
    setIsSubmitting(false);
    redirect("/contacts");
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  function getRandomColor() {
    const colors = [
      "bg-blue-600",
      "bg-purple-600",
      "bg-green-600",
      "bg-yellow-600",
      "bg-red-600",
      "bg-pink-600",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Add Contact</h1>
        <p className="text-gray-400">Add a new contact to your network</p>
      </header>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl">New Contact</CardTitle>
          <CardDescription>
            Fill in the details to add a new contact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactWith">Contact Address</Label>
              <Input
                id="contactWith"
                placeholder="Enter contact ID"
                className="bg-gray-700 border-gray-600 text-white"
                {...form.register("contactWith")}
              />
              {form.formState.errors.contactWith && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.contactWith.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Contact Name</Label>
              <Input
                id="name"
                placeholder="Enter contact name"
                className="bg-gray-700 border-gray-600 text-white"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Contact...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Contact
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {recentContacts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Recently Added</h2>
          <div className="space-y-3">
            {recentContacts.map((contact, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Avatar className={`h-10 w-10 mr-4 ${getRandomColor()}`}>
                      <AvatarFallback>
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-sm text-gray-400">
                        Address: {contact.contactWith}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

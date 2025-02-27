"use server";

import prisma from "@/lib/prisma";

export async function CreateContactAction(formData: FormData) {

  const contactOf = formData.get("contactOf")?? "enter id";
  const name = formData.get("name") as string;

  try {
    await prisma.contact.create({
      data: {
        contactOf: contactOf,
        name: name,
        contactWith: "enter id",
      },
    });
    return {
      message: "Contact created successfully",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }
    return {
      message: "Something went wrong",
    };
  }
}

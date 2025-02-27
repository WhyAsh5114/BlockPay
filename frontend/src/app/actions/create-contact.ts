"use server";

import prisma from "@/lib/prisma";

export async function CreateContactAction(formData: FormData) {

  const contactOf = formData.get("contactOf") as string;
  const contactWith = formData.get("contactWith") as string;
  const name = formData.get("name") as string;

  try {
    await prisma.contact.create({
      data: {
        contactOf: contactOf,
        name: name,
        contactWith
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

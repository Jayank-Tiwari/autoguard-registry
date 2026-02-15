"use server";

import { prisma } from "@/lib/prisma"; // Assuming you have prisma set up

export async function submitFeedback(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const type = formData.get("type") as string;
  const message = formData.get("message") as string;
  const rating = formData.get("rating") as string;

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TODO: Connect this to your database
  // await prisma.feedback.create({
  //     data: { name, email, type, message, rating: parseInt(rating) }
  // });

  console.log("Feedback Received:", { name, email, type, message, rating });

  return { success: true };
}

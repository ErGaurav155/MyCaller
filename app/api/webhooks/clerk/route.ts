/* eslint-disable camelcase */
import { createUser, deleteUser, updateUser } from "@/lib/action/user.actions";
import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Get the ID and type
  const eventType = evt.type;

  // CREATE
  if (eventType === "user.created") {
    const { id, email_addresses, username, public_metadata } = evt.data;

    const phone = (public_metadata?.phone as string) || "";
    const twilioNumber = (public_metadata?.twilioNumber as string) || "";
    const isActive = (public_metadata?.isActive as boolean) || false;
    const whatsappNumber = (public_metadata?.whatsappNumber as string) || " ";
    const plan = (public_metadata?.plan as string) || " ";

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username || "",

      phone,
      whatsappNumber,
      twilioNumber,
      isActive,
      plan,
    };

    try {
      const newUser = await createUser(user);

      // Set public metadata
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      return NextResponse.json({ message: "OK", user: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { message: "Error creating user" },
        { status: 500 }
      );
    }
  }

  // UPDATE
  if (eventType === "user.updated") {
    const { id, username, public_metadata } = evt.data;

    const phone = (public_metadata?.phone as string) || "";
    const twilioNumber = (public_metadata?.twilioNumber as string) || "";
    const isActive = (public_metadata?.isActive as boolean) || false;
    const whatsappNumber = (public_metadata?.whatsappNumber as string) || " ";
    const plan = (public_metadata?.plan as string) || " ";

    try {
      const updatedUser = await updateUser(id, {
        username: username || "",
        whatsappNumber,
        phone,
        twilioNumber,
        isActive,
        plan,
      });

      return NextResponse.json({ message: "OK", user: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { message: "Error updating user" },
        { status: 500 }
      );
    }
  }

  // DELETE
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      await deleteUser(id!);
      return NextResponse.json({ message: "OK" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { message: "Error deleting user" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "OK" });
}

export const dynamic = "force-dynamic";

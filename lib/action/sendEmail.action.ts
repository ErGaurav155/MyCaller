"use server";

import nodemailer from "nodemailer";

import { Twilio } from "twilio";
import { handleError } from "../utils";

export const sendSubscriptionEmailToOwner = async ({
  name,
  phone,
  email,
  source,
  aineed,
  message,
}: {
  name: string;
  phone: string;
  email: string;
  source: string;
  aineed: string;
  message?: string;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "New Apointment Alert",
      text: `Congratulations! A customer has Booked an Appointment. Name: ${name}, Email: ${email}, Phone: ${phone}, Source: ${source}, AI Need: ${aineed}, Message: ${
        message || "No message provided"
      }. Please contact them as soon as possible.`,
    };

    await transporter.sendMail(mailOptions);
    await sendWhatsAppInfo({
      name,
      phone,
      email,
      source,
      aineed,
      message,
    });
    return JSON.parse(
      JSON.stringify({ status: 200, message: "Email sent successfully" })
    );
  } catch (error) {
    handleError(error);
  }
};

export async function sendSubscriptionEmailToUser(email: string) {
  try {
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send confirmation to subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Subscription Confirmed",
      text: `You've subscribed to Gaurav Khaire's updates!\n\nYou'll receive updates about AI and web development.\n\nUnsubscribe anytime by replying STOP.`,
      html: `<p>You've subscribed to <strong>Gaurav Khaire</strong>'s updates!</p><p>You'll receive updates about AI and web development.</p><p><em>Unsubscribe anytime by replying STOP.</em></p>`,
    });

    // Send notification to yourself
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "gauravgkhaire@gmail.com",
      subject: "New Subscriber",
      text: `New subscription:\n\nEmail: ${email}\n\nAdd to your mailing list.`,
    });
    return JSON.parse(
      JSON.stringify({ status: 200, message: "Email sent successfully" })
    );
  } catch (error) {
    return JSON.parse(
      JSON.stringify({ status: 500, message: "Failed to process subscription" })
    );
  }
}

interface SendWhatsAppInfoParams {
  name: string;
  phone: string;
  email: string;
  source: string;
  aineed: string;
  message?: string;
}

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppInfo({
  name,
  phone,
  email,
  source,
  aineed,
  message,
}: SendWhatsAppInfoParams) {
  try {
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.WHATSAPP_NUMBER
    ) {
      throw new Error("Twilio credentials are not set");
    }

    const PhoneNumber = process.env.WHATSAPP_NUMBER;
    const result = await client.messages.create({
      from: `whatsapp:${process.env.NEXT_PUBLIC_TWILIO_NUMBER}`,
      to: `whatsapp:${PhoneNumber}`,
      contentSid: process.env.YOUR_MESSAGE_CONTENT_SID_HERE, // Replace with your template's Content SID
      contentVariables: JSON.stringify({
        "1": name,
        "2": email,
        "3": phone || "Not provided",
        "4": message || "No message",
        "5": aineed || "No message",
        "6": source || "No message",
      }),
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return {
      success: false,
      data: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

import twilio from 'twilio';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error('Twilio credentials are not configured');
}

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const validateTwilioRequest = (
  signature: string,
  url: string,
  params: Record<string, any>
): boolean => {
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    signature,
    url,
    params
  );
};
import crypto from "crypto";

const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID!;
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY!;
const IS_PRODUCTION = process.env.DOKU_IS_PRODUCTION === "true";

export const DOKU_BASE_URL = IS_PRODUCTION
  ? "https://api.doku.com"
  : "https://api-sandbox.doku.com";

export const CHECKOUT_PATH = "/checkout/v1/payment";

/**
 * Generate DOKU request signature
 * Format: HMACSHA256=base64(HMAC-SHA256(stringToSign, secretKey))
 * stringToSign = "Client-Id:{clientId}\nRequest-Id:{requestId}\nRequest-Timestamp:{timestamp}\nRequest-Target:{path}\nDigest:{digest}"
 */
export function generateSignature({
  requestId,
  timestamp,
  path,
  body,
}: {
  requestId: string;
  timestamp: string;
  path: string;
  body: object;
}): string {
  const minifiedBody = JSON.stringify(body);
  const digest = crypto
    .createHash("sha256")
    .update(minifiedBody)
    .digest("base64");

  const stringToSign = [
    `Client-Id:${DOKU_CLIENT_ID}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${timestamp}`,
    `Request-Target:${path}`,
    `Digest:${digest}`,
  ].join("\n");

  const signature = crypto
    .createHmac("sha256", DOKU_SECRET_KEY)
    .update(stringToSign)
    .digest("base64");

  return `HMACSHA256=${signature}`;
}

/**
 * Verify DOKU webhook signature
 */
export function verifyWebhookSignature({
  clientId,
  requestId,
  timestamp,
  path,
  body,
  incomingSignature,
}: {
  clientId: string;
  requestId: string;
  timestamp: string;
  path: string;
  body: object;
  incomingSignature: string;
}): boolean {
  const minifiedBody = JSON.stringify(body);
  const digest = crypto
    .createHash("sha256")
    .update(minifiedBody)
    .digest("base64");

  const stringToSign = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${timestamp}`,
    `Request-Target:${path}`,
    `Digest:${digest}`,
  ].join("\n");

  const expectedSignature =
    "HMACSHA256=" +
    crypto
      .createHmac("sha256", DOKU_SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

  return incomingSignature === expectedSignature;
}

export { DOKU_CLIENT_ID };

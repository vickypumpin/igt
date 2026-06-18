import { db, settingsTable } from "@workspace/db";

export interface CollectionResult {
  paymentUrl: string;
  gateway: "paystack" | "flutterwave";
}

export interface VerifyResult {
  verified: boolean;
  amount?: number;
  currency?: string;
}

export interface DisbursementResult {
  transferRef: string;
  gateway: "paystack" | "flutterwave";
}

export interface GatewayKeys {
  flutterwave: { secretKey: string | null; publicKey: string | null; encKey: string | null; live: boolean };
  paystack: { secretKey: string | null; publicKey: string | null; live: boolean };
  preferred: string;
}

export async function getGatewayKeys(): Promise<GatewayKeys> {
  const [s] = await db.select({
    fwSecret: settingsTable.flutterwaveSecretKey,
    fwPublic: settingsTable.flutterwavePublicKey,
    fwEnc: settingsTable.flutterwaveEncryptionKey,
    fwLive: settingsTable.flutterwaveLive,
    psSecret: settingsTable.paystackSecretKey,
    psPublic: settingsTable.paystackPublicKey,
    psLive: settingsTable.paystackLive,
    preferred: settingsTable.preferredPaymentGateway,
  }).from(settingsTable).limit(1);

  return {
    flutterwave: { secretKey: s?.fwSecret ?? null, publicKey: s?.fwPublic ?? null, encKey: s?.fwEnc ?? null, live: s?.fwLive ?? false },
    paystack: { secretKey: s?.psSecret ?? null, publicKey: s?.psPublic ?? null, live: s?.psLive ?? false },
    preferred: s?.preferred ?? "flutterwave",
  };
}

// ── Flutterwave collection ────────────────────────────────────────────────────

async function fwInitiateCollection(params: {
  secretKey: string;
  txRef: string;
  amount: number;
  currency: string;
  redirectUrl: string;
  customerEmail: string;
  customerName: string;
  description: string;
  meta?: Record<string, unknown>;
}): Promise<string> {
  const resp = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: { "Authorization": `Bearer ${params.secretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirectUrl,
      customer: { email: params.customerEmail, name: params.customerName },
      meta: params.meta,
      customizations: { title: "iGoTrend", description: params.description },
    }),
  });
  const data = await resp.json() as { status: string; data?: { link: string }; message?: string };
  if (data.status === "success" && data.data?.link) return data.data.link;
  throw new Error(data.message ?? "Flutterwave payment initiation failed");
}

async function fwVerifyCollection(txRef: string, secretKey: string): Promise<VerifyResult> {
  const resp = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`, {
    headers: { "Authorization": `Bearer ${secretKey}` },
  });
  const data = await resp.json() as { status: string; data?: { status: string; amount?: number; charged_amount?: number; currency?: string } };
  if (data.status === "success" && data.data?.status === "successful") {
    return { verified: true, amount: data.data.charged_amount ?? data.data.amount, currency: data.data.currency };
  }
  return { verified: false };
}

async function fwInitiateDisbursement(params: {
  secretKey: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  reference: string;
  currency?: string;
}): Promise<string> {
  const resp = await fetch("https://api.flutterwave.com/v3/transfers", {
    method: "POST",
    headers: { "Authorization": `Bearer ${params.secretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      account_bank: params.bankCode,
      account_number: params.accountNumber,
      amount: params.amount,
      currency: params.currency ?? "NGN",
      narration: `iGoTrend payout — ${params.reference}`,
      reference: params.reference,
      beneficiary_name: params.accountName,
    }),
  });
  const data = await resp.json() as { status: string; data?: { reference?: string; id?: number }; message?: string };
  if (data.status === "success") return data.data?.reference ?? params.reference;
  throw new Error(data.message ?? "Flutterwave transfer failed");
}

// ── Paystack collection ───────────────────────────────────────────────────────

async function psInitiateCollection(params: {
  secretKey: string;
  txRef: string;
  amount: number;
  currency: string;
  redirectUrl: string;
  customerEmail: string;
  description: string;
  meta?: Record<string, unknown>;
}): Promise<string> {
  const resp = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { "Authorization": `Bearer ${params.secretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      reference: params.txRef,
      amount: Math.round(params.amount * 100),
      currency: params.currency,
      callback_url: params.redirectUrl,
      email: params.customerEmail,
      metadata: { custom_fields: [{ display_name: "Order", variable_name: "order", value: params.description }], ...params.meta },
    }),
  });
  const data = await resp.json() as { status: boolean; data?: { authorization_url?: string }; message?: string };
  if (data.status && data.data?.authorization_url) return data.data.authorization_url;
  throw new Error(data.message ?? "Paystack payment initiation failed");
}

async function psVerifyCollection(reference: string, secretKey: string): Promise<VerifyResult> {
  const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { "Authorization": `Bearer ${secretKey}` },
  });
  const data = await resp.json() as { status: boolean; data?: { status: string; amount?: number; currency?: string } };
  if (data.status && data.data?.status === "success") {
    const koboAmount = data.data.amount ?? 0;
    return { verified: true, amount: koboAmount / 100, currency: data.data.currency };
  }
  return { verified: false };
}

async function psInitiateDisbursement(params: {
  secretKey: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  reference: string;
  currency?: string;
}): Promise<string> {
  const recipResp = await fetch("https://api.paystack.co/transferrecipient", {
    method: "POST",
    headers: { "Authorization": `Bearer ${params.secretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "nuban",
      name: params.accountName,
      account_number: params.accountNumber,
      bank_code: params.bankCode,
      currency: params.currency ?? "NGN",
    }),
  });
  const recipData = await recipResp.json() as { status: boolean; data?: { recipient_code?: string }; message?: string };
  if (!recipData.status || !recipData.data?.recipient_code) {
    throw new Error(recipData.message ?? "Failed to create Paystack transfer recipient");
  }

  const transferResp = await fetch("https://api.paystack.co/transfer", {
    method: "POST",
    headers: { "Authorization": `Bearer ${params.secretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "balance",
      amount: Math.round(params.amount * 100),
      recipient: recipData.data.recipient_code,
      reason: `iGoTrend payout — ${params.reference}`,
      reference: params.reference,
    }),
  });
  const transferData = await transferResp.json() as { status: boolean; data?: { reference?: string }; message?: string };
  if (transferData.status) return transferData.data?.reference ?? params.reference;
  throw new Error(transferData.message ?? "Paystack transfer failed");
}

// ── Gateway selector ──────────────────────────────────────────────────────────

function selectGateway(keys: GatewayKeys): ("paystack" | "flutterwave")[] {
  const { preferred, paystack, flutterwave } = keys;
  const hasPS = !!paystack.secretKey;
  const hasFW = !!flutterwave.secretKey;

  if (preferred === "paystack") return hasPS ? ["paystack", "flutterwave"].filter(g => g === "paystack" || hasFW) as ("paystack" | "flutterwave")[] : hasFW ? ["flutterwave"] : [];
  if (preferred === "flutterwave") return hasFW ? ["flutterwave", "paystack"].filter(g => g === "flutterwave" || hasPS) as ("paystack" | "flutterwave")[] : hasPS ? ["paystack"] : [];
  // auto: try whichever is configured
  const order: ("paystack" | "flutterwave")[] = [];
  if (hasFW) order.push("flutterwave");
  if (hasPS) order.push("paystack");
  return order;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function initiateCollection(params: {
  txRef: string;
  amount: number;
  currency: string;
  redirectUrl: string;
  customerEmail: string;
  customerName: string;
  description: string;
  meta?: Record<string, unknown>;
}): Promise<CollectionResult> {
  const keys = await getGatewayKeys();
  const order = selectGateway(keys);
  if (!order.length) throw new Error("No payment gateway configured. Add Paystack or Flutterwave keys in Settings.");

  let lastErr: Error | null = null;
  for (const gw of order) {
    try {
      if (gw === "flutterwave" && keys.flutterwave.secretKey) {
        const paymentUrl = await fwInitiateCollection({ secretKey: keys.flutterwave.secretKey, ...params });
        return { paymentUrl, gateway: "flutterwave" };
      }
      if (gw === "paystack" && keys.paystack.secretKey) {
        const paymentUrl = await psInitiateCollection({ secretKey: keys.paystack.secretKey, ...params });
        return { paymentUrl, gateway: "paystack" };
      }
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastErr ?? new Error("All payment gateways failed");
}

export async function verifyCollection(txRef: string, gateway: string | null): Promise<VerifyResult> {
  const keys = await getGatewayKeys();

  if (gateway === "paystack" && keys.paystack.secretKey) {
    return psVerifyCollection(txRef, keys.paystack.secretKey);
  }
  if (gateway === "flutterwave" && keys.flutterwave.secretKey) {
    return fwVerifyCollection(txRef, keys.flutterwave.secretKey);
  }

  // Unknown gateway — try both
  if (keys.flutterwave.secretKey) {
    const r = await fwVerifyCollection(txRef, keys.flutterwave.secretKey);
    if (r.verified) return r;
  }
  if (keys.paystack.secretKey) {
    return psVerifyCollection(txRef, keys.paystack.secretKey);
  }
  throw new Error("No payment gateway configured");
}

export async function initiateDisbursement(params: {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  reference: string;
  currency?: string;
}): Promise<DisbursementResult> {
  const keys = await getGatewayKeys();
  const order = selectGateway(keys);
  if (!order.length) throw new Error("No payment gateway configured. Add Paystack or Flutterwave keys in Settings.");

  let lastErr: Error | null = null;
  for (const gw of order) {
    try {
      if (gw === "flutterwave" && keys.flutterwave.secretKey) {
        const transferRef = await fwInitiateDisbursement({ secretKey: keys.flutterwave.secretKey, ...params });
        return { transferRef, gateway: "flutterwave" };
      }
      if (gw === "paystack" && keys.paystack.secretKey) {
        const transferRef = await psInitiateDisbursement({ secretKey: keys.paystack.secretKey, ...params });
        return { transferRef, gateway: "paystack" };
      }
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastErr ?? new Error("All payment gateways failed");
}

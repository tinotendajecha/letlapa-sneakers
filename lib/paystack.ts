// lib/paystack.ts
export async function paystack<T = any>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const headers = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
    ...init?.headers,
  };
  const res = await fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers,
    body: init?.json ? JSON.stringify(init.json) : init?.body,
    // IMPORTANT: Paystack requires POST/GET over HTTPS; Next runtime is fine.
  });
  const data = (await res.json()) as any;
  if (!res.ok || data?.status === false) {
    const msg = data?.message || `Paystack request failed: ${path}`;
    throw new Error(msg);
  }
  return data;
}

// app/checkout/page.tsx
const dynamicMode = "force-dynamic";
export const revalidate = 0;

import dynamic from "next/dynamic";

const ClientCheckout = dynamic(() => import("./ClientCheckout"), { ssr: false });

export default function Page() {
  return <ClientCheckout />;
}

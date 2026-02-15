import { getAdminSession } from "@/lib/auth";
import { headers } from "next/headers";
import QRCardClient from "./qr-card-client";

interface QRCardPageProps {
  params: Promise<{ vehicleNumber: string }>;
}

export default async function QRCardPage({ params }: QRCardPageProps) {
  // 1. Await and decode params
  const resolvedParams = await params;
  const vehicleNumber = decodeURIComponent(resolvedParams.vehicleNumber);

  // 2. Check session
  const session = await getAdminSession();

  // 3. Get the origin (domain) from the server request headers
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  return (
    <QRCardClient
      vehicleNumber={vehicleNumber}
      isAdmin={Boolean(session)}
      origin={origin}
    />
  );
}

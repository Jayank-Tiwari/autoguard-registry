import { getAdminSession } from "@/lib/auth";
import QRCardClient from "./qr-card-client";

interface QRCardPageProps {
    params: Promise<{ vehicleNumber: string }>;
}

export default async function QRCardPage({ params }: QRCardPageProps) {
    const session = await getAdminSession();
    const { vehicleNumber } = await params;

    return (
        <QRCardClient
            vehicleNumber={vehicleNumber}
            isAdmin={Boolean(session)}
        />
    );
}

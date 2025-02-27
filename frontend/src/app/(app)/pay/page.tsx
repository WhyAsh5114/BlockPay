"use client";

import TypographyH2 from "@/components/typography/h2";
import dynamic from "next/dynamic";
import { useState } from "react";

const MoonPayBuyWidget = dynamic(
    () => import('@moonpay/moonpay-react').then((mod) => mod.MoonPayBuyWidget),
    { ssr: false },
);

export default function PayPage() {
    const [walletAddress, setWalletAddress] = useState<string>();

    return <>
        <TypographyH2>Pay to contacts</TypographyH2>
        <MoonPayBuyWidget
            variant="overlay"
            baseCurrencyCode="usd"
            baseCurrencyAmount="100"
            defaultCurrencyCode="usdc"
            walletAddress={walletAddress}
            visible={walletAddress !== undefined}
        />
    </>
}

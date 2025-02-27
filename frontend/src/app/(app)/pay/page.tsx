"use client";

import { useState } from "react";
import { MoonpayService } from "@/../../moonpay.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const moonpayService = new MoonpayService();

export default function PayPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [widgetUrl, setWidgetUrl] = useState("");

  const handleGenerateUrl = async () => {
    try {
      const url = await moonpayService.getBuyWidgetUrl(walletAddress, redirectUrl);
      setWidgetUrl(url);
    } catch (error) {
      console.error("Error generating MoonPay widget URL:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Pay with MoonPay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="wallet-address">Wallet Address</Label>
            <Input
              id="wallet-address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your wallet address"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="redirect-url">Redirect URL</Label>
            <Input
              id="redirect-url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="Enter redirect URL after payment"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleGenerateUrl}>Generate Payment URL</Button>
        </CardFooter>
      </Card>
      {widgetUrl && (
        <div className="mt-4">
          <a href={widgetUrl} target="_blank" rel="noopener noreferrer">
            <Button>Proceed to Payment</Button>
          </a>
        </div>
      )}
    </div>
  );
}

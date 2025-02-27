"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Contact } from '@prisma/client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useAccount } from 'wagmi';

const MoonPayBuyWidget = dynamic(
    () => import('@moonpay/moonpay-react').then((mod) => mod.MoonPayBuyWidget),
    { ssr: false },
);

export default function PaymentForm({ _contacts }: { _contacts: Contact[] }) {
    const [amount, setAmount] = useState('')
    const [selectedContact, setSelectedContact] = useState<string>('')
    const [showMoonpay, setShowMoonpay] = useState(false)
    const { address } = useAccount();

    const contacts = _contacts.filter(c => c.contactOf === address)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || !selectedContact) return
        setShowMoonpay(true)
    }


    return (
        <>
            {<form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="contact">Send to</Label>
                    <Select
                        value={selectedContact}
                        onValueChange={setSelectedContact}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select contact" />
                        </SelectTrigger>
                        <SelectContent>
                            {contacts.map(contact => (
                                <SelectItem key={contact.contactWith} value={contact.contactWith}>
                                    {contact.name} ({contact.contactWith})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                </div>

                <Button type="submit" className="w-full">
                    Send payment
                </Button>
            </form>}

            {showMoonpay && (
                <div className="-ml-4">
                    <MoonPayBuyWidget
                        variant="overlay"
                        baseCurrencyCode="usd"
                        baseCurrencyAmount={(amount)}
                        currencyCode='usdc'
                        onClose={async () => setShowMoonpay(false)}
                        walletAddress={contacts.find(c => c.contactWith === selectedContact)?.contactWith}
                    />
                </div>
            )}
        </>
    )
}

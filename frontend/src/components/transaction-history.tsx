"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionSummary } from "./transaction-summary";
import { TransactionItem } from "./transaction-items";
import { Payment } from "@prisma/client";
import { useAccount } from "wagmi";

export default function TransactionHistory({
  transactions,
}: {
  transactions: Payment[];
}) {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate total sent and received
  const totalSent = transactions
    .filter((tx) => tx.fromAddress === address)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalReceived = transactions
    .filter((tx) => tx.toAddress === address)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.fromAddress.includes(searchQuery) ||
      tx.toAddress.includes(searchQuery)
  );

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">CryptoWallet</h1>
        <p className="text-gray-400">Transaction History</p>
      </header>

      <TransactionSummary sent={totalSent} received={totalReceived} />

      <div className="relative mt-6 mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search transactions..."
          className="pl-10 bg-gray-800 border-gray-700 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="grid grid-cols-3 bg-gray-800">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              isOutgoing={tx.fromAddress === address}
              currentUserAddress={address!}
            />
          ))}
        </TabsContent>

        <TabsContent value="sent" className="mt-4 space-y-3">
          {filteredTransactions
            .filter((tx) => tx.fromAddress === address)
            .map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                isOutgoing={true}
                currentUserAddress={address!}
              />
            ))}
        </TabsContent>

        <TabsContent value="received" className="mt-4 space-y-3">
          {filteredTransactions
            .filter((tx) => tx.toAddress === address)
            .map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                isOutgoing={false}
                currentUserAddress={address!}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

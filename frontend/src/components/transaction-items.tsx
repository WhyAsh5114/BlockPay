"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Copy, ExternalLink } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TransactionProps {
  transaction: {
    fromAddress: string;
    toAddress: string;
    amount: number;
    createdAt: Date;
  };
  isOutgoing: boolean;
  currentUserAddress: string;
}

export function TransactionItem({
  transaction,
  isOutgoing,
  currentUserAddress,
}: TransactionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const counterpartyAddress = isOutgoing
    ? transaction.toAddress
    : transaction.fromAddress;

  return (
    <Card className="bg-gray-800 border-gray-700 p-4 hover:bg-gray-750 transition-colors">
      <div className="flex items-center">
        <div
          className={`rounded-full p-2 mr-3 ${isOutgoing ? "bg-red-900/20" : "bg-green-900/20"}`}
        >
          {isOutgoing ? (
            <ArrowUpRight className="h-5 w-5 text-red-400" />
          ) : (
            <ArrowDownLeft className="h-5 w-5 text-green-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {isOutgoing ? "Sent" : "Received"}
              </h3>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <span>{truncateAddress(counterpartyAddress)}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => copyToClipboard(counterpartyAddress)}
                        className="ml-1 text-gray-500 hover:text-gray-300"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "Copied!" : "Copy address"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`font-semibold ${isOutgoing ? "text-red-400" : "text-green-400"}`}
              >
                {isOutgoing ? "-" : "+"}
                {transaction.amount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(transaction.createdAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

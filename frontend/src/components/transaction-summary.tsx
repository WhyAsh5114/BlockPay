"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TransactionSummaryProps {
  sent: number;
  received: number;
}

export function TransactionSummary({
  sent,
  received,
}: TransactionSummaryProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-0 p-5 rounded-xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center">
            <div className="rounded-full bg-green-900/20 p-1.5 mr-2">
              <ArrowDownLeft className="h-4 w-4 text-green-400" />
            </div>
            <span className="text-sm text-gray-200">Received</span>
          </div>
          <p className="text-xl font-semibold mt-2">
            {received.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center">
            <div className="rounded-full bg-red-900/20 p-1.5 mr-2">
              <ArrowUpRight className="h-4 w-4 text-red-400" />
            </div>
            <span className="text-sm text-gray-200">Sent</span>
          </div>
          <p className="text-xl font-semibold mt-2">{sent.toLocaleString()}</p>
        </div>
      </div>
    </Card>
  );
}

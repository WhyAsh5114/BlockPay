import TransactionHistory from "@/components/transaction-history";
import prisma from "@/lib/prisma";

export default async function PaymentHistory() {
  const data = await prisma.payment.findMany();

  return (
    <div>
      <TransactionHistory transactions={data} />
    </div>
  );
}

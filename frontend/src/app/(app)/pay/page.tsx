import PaymentForm from '@/components/payment-form';
import prisma from '@/lib/prisma';

export default async function PayPage() {
    const contacts = await prisma.contact.findMany()

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Send Payment</h1>
            <PaymentForm _contacts={contacts} />
        </div>
    )
}

import { AlatPayCheckout } from '../../components/AlatPayCheckout';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#621063]">SMART ASSETZ</p>
        <h1 className="mt-3 text-3xl font-black">Checkout</h1>
        <p className="mt-2 text-sm text-slate-600">
          Inline ALATPay checkout keeps the user in the app while still using the secure Wema payment flow.
        </p>

        <div className="mt-8">
          <AlatPayCheckout
            amount={3500}
            email="buyer@smartassetz.com"
            label="Property booking payment"
            metadata={{ intent: 'booking' }}
          />
        </div>
      </div>
    </main>
  );
}

export default function PaymentsPage() {
  return (
    <section className="min-h-[60vh] bg-yellow-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in">Payments</h1>
        <p className="text-gray-800 leading-relaxed text-lg mb-6 animate-slide-up">
          Secure and easy payments. Choose your preferred method and complete your transaction safely.
        </p>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bank Transfer</h2>
            <p className="text-gray-700">Contact us via the contact page to receive invoice and bank details.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">UPI / Card</h2>
            <p className="text-gray-700">We support popular UPI and card providers. Coming soon on this page.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

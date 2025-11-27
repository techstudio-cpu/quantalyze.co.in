export default function TermsPage() {
  return (
    <section className="min-h-[60vh] bg-yellow-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in">Terms & Conditions</h1>
        <p className="text-gray-800 leading-relaxed mb-4 animate-slide-up">
          These Terms & Conditions outline the rules and regulations for using our website and services.
        </p>
        <div className="space-y-6 mt-8">
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Use of Service</h2>
            <p className="text-gray-700">By accessing our site, you agree to comply with these terms and all applicable laws.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Intellectual Property</h2>
            <p className="text-gray-700">All content, trademarks, and assets are the property of their respective owners.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Contact</h2>
            <p className="text-gray-700">For any queries regarding these terms, contact us via the contact page.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

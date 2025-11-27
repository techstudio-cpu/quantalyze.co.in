export default function PrivacyPolicyPage() {
  return (
    <section className="min-h-[60vh] bg-yellow-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in">Privacy Policy</h1>
        <p className="text-gray-800 leading-relaxed mb-4 animate-slide-up">
          Your privacy is important to us. This policy explains what data we collect, how we use it, and your rights.
        </p>
        <div className="space-y-6 mt-8">
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Information We Collect</h2>
            <p className="text-gray-700">Contact details, analytics data, and form submissions you choose to provide.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">How We Use Information</h2>
            <p className="text-gray-700">To provide services, improve our website, and respond to inquiries.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Contact</h2>
            <p className="text-gray-700">For privacy questions, contact us via the contact page.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

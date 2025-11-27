export default function DisclaimerPage() {
  return (
    <section className="min-h-[60vh] bg-yellow-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in">Disclaimer</h1>
        <p className="text-gray-800 leading-relaxed mb-4 animate-slide-up">
          The information provided on this website is for general informational purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability, or completeness of any information.
        </p>
        <div className="space-y-6 mt-8">
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">External Links</h2>
            <p className="text-gray-700">Our website may contain links to other websites. We do not assume responsibility for the content, privacy practices, or policies of any third-party sites.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-yellow-200 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Professional Advice</h2>
            <p className="text-gray-700">The content is not professional advice. Please consult with a qualified professional for specific guidance.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

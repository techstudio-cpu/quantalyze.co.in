export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-fade-in">About Us</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto animate-slide-up">
            Quantalyze is a leading digital marketing agency delivering data-driven strategies and creative solutions that drive measurable business growth.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Leading the Way in Digital Excellence</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Quantalyze is a full-service digital marketing agency that combines creative thinking with data-driven strategies to help businesses achieve their goals. We specialize in delivering comprehensive marketing solutions that drive measurable results and sustainable growth.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our team of experienced professionals brings expertise across all facets of digital marketing—from social media strategy and content creation to SEO, paid advertising, and technical implementation. We don't just execute campaigns; we build lasting partnerships with our clients.
              </p>
              <p className="text-gray-700 leading-relaxed">
                What sets us apart is our commitment to understanding your unique business challenges and crafting customized strategies that align with your objectives. We leverage cutting-edge tools, industry best practices, and continuous optimization to ensure your brand stands out in the digital landscape.
              </p>
            </div>
            <div className="bg-yellow-50 p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">✓</span>
                  <span>Strategy-first planning and execution</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">✓</span>
                  <span>Data-driven decision making</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">✓</span>
                  <span>Creative and innovative solutions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">✓</span>
                  <span>Results-focused campaigns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">✓</span>
                  <span>Transparent communication</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-700">To empower businesses with cutting-edge digital solutions that drive growth and success.</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-700">To be the most trusted digital marketing partner for businesses worldwide.</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Values</h3>
              <p className="text-gray-700">Integrity, innovation, excellence, and client success at the heart of everything we do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Why Choose Digital Master?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Expert Team", desc: "Experienced professionals dedicated to your success" },
              { title: "Proven Results", desc: "Track record of delivering measurable outcomes" },
              { title: "Latest Technology", desc: "Cutting-edge tools and techniques" },
              { title: "24/7 Support", desc: "Always here when you need us" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

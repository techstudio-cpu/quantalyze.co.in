export default function WebsiteDevPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">Website Development Services</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Build fast, beautiful, and conversion-optimized websites with modern technologies that deliver exceptional user experiences and drive business growth.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Website Development</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your website is often the first interaction potential customers have with your brand. Our website development services create powerful online experiences that captivate visitors, communicate value, and drive conversions. We build websites that are not only visually stunning but also fast, secure, accessible, and optimized for search engines.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We specialize in custom website development using modern frameworks and technologies including React, Next.js, WordPress, Shopify, and more. Whether you need a corporate website, e-commerce platform, landing page, or web application, our team delivers solutions tailored to your specific needs and business objectives.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Every website we build follows industry best practices for performance, security, SEO, and user experience. We create responsive designs that work flawlessly across all devices and browsers, ensuring every visitor has a seamless experience regardless of how they access your site.
            </p>
          </div>

          {/* Services */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Web Development Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Website Development</h3>
                <p className="text-gray-700 mb-3">
                  Bespoke websites built from scratch to match your exact requirements, brand identity, and business goals with complete creative freedom.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Custom design and development</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Modern tech stack (React, Next.js)</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Headless CMS integration</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>API development and integration</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Database design and optimization</span></li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">E-commerce Development</h3>
                <p className="text-gray-700 mb-3">
                  Full-featured online stores with secure payment processing, inventory management, and seamless shopping experiences that drive sales.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Shopify and WooCommerce stores</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Product catalog management</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Payment gateway integration</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Shopping cart optimization</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Order management systems</span></li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">WordPress Development</h3>
                <p className="text-gray-700 mb-3">
                  Custom WordPress websites with intuitive content management, custom themes, and plugins tailored to your workflow and requirements.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Custom theme development</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Plugin development and customization</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Performance optimization</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Security hardening</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Maintenance and updates</span></li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Landing Page Development</h3>
                <p className="text-gray-700 mb-3">
                  High-converting landing pages optimized for specific campaigns, products, or services with focused messaging and clear calls-to-action.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Conversion-focused design</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>A/B testing setup</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Form and lead capture integration</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Analytics tracking</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Fast load times</span></li>
                </ul>
              </div>

            </div>
          </div>

          {/* Technologies */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Technologies We Use</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Frontend</h3>
                <p className="text-gray-600 text-sm">React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Backend</h3>
                <p className="text-gray-600 text-sm">Node.js, PHP, Python, Express, RESTful APIs</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">CMS</h3>
                <p className="text-gray-600 text-sm">WordPress, Contentful, Sanity, Strapi</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">E-commerce</h3>
                <p className="text-gray-600 text-sm">Shopify, WooCommerce, Magento, Custom solutions</p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl border border-yellow-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Our Websites Stand Out</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast Performance</h3>
                <p className="text-gray-700 text-sm">Optimized code, image compression, lazy loading, and caching ensure your site loads in under 3 seconds.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mobile-First Design</h3>
                <p className="text-gray-700 text-sm">Responsive layouts that look and work beautifully on smartphones, tablets, and desktops.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">SEO Optimized</h3>
                <p className="text-gray-700 text-sm">Clean code, semantic HTML, meta tags, and structured data help search engines understand and rank your content.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Security First</h3>
                <p className="text-gray-700 text-sm">SSL certificates, secure hosting, regular updates, and security best practices protect your site and users.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Scalable Architecture</h3>
                <p className="text-gray-700 text-sm">Built to grow with your business, handling increased traffic and functionality without performance issues.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Content Management</h3>
                <p className="text-gray-700 text-sm">Intuitive admin interfaces that make updating content, adding pages, and managing your site simple.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Build Your Dream Website?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Let's create a website that elevates your brand and drives business growth.
          </p>
          <a href="/contact/" className="inline-block px-8 py-4 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-lg">
            Start Your Project
          </a>
        </div>
      </section>
    </>
  );
}

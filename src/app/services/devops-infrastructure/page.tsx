export default function DevOpsInfrastructurePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">DevOps & Cloud Infrastructure</h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Build scalable, secure, and reliable infrastructure with modern DevOps practices, containerization, and cloud deployment solutions.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">Technical Implementation by:</span>
            <a href="https://techstudio.co.in" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 font-bold underline">
              Tech Studio
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Overview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional DevOps & Infrastructure Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Modern applications require robust infrastructure and efficient deployment pipelines. Our DevOps and cloud infrastructure services help you build scalable systems that can handle growth, ensure high availability, and maintain security. We implement industry best practices for containerization, continuous integration/deployment, monitoring, and infrastructure as code.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              From setting up Docker containers and Kubernetes orchestration to implementing CI/CD pipelines and cloud deployments, we provide end-to-end infrastructure solutions. Our approach emphasizes automation, reproducibility, and security, ensuring your applications run smoothly in production environments.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Technical implementation is handled by <a href="https://techstudio.co.in" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline font-semibold">Tech Studio</a>, with expertise in Docker, AWS, DigitalOcean, GitHub Actions, and modern DevOps tooling.
            </p>
          </div>

          {/* Services */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our DevOps Services</h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Dockerized VPS Setup</h3>
                <p className="text-gray-700 mb-3">
                  Complete Docker-based deployment on VPS with SSL certificates, reverse proxy, and production-ready configuration for your applications.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Docker container setup</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Nginx reverse proxy configuration</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>SSL certificate installation (Let's Encrypt)</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Database containerization</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Environment variable management</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Docker Compose orchestration</span></li>
                </ul>
                <a href="https://techstudio.co.in/quote/dockerized-vps-setup" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                  Request Quote
                </a>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">CI/CD Pipeline Setup</h3>
                <p className="text-gray-700 mb-3">
                  Automated deployment pipelines with GitHub Actions that test, build, and deploy your code automatically on every commit or release.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>GitHub Actions workflows</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Automated testing integration</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Build and deployment automation</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Version management and tagging</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Rollback capabilities</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Staging and production environments</span></li>
                </ul>
                <a href="https://techstudio.co.in/quote/ci-cd-pipeline" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                  Request Quote
                </a>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Domain & Hosting Setup</h3>
                <p className="text-gray-700 mb-3">
                  Complete domain registration, DNS configuration, hosting setup, and branded email configuration to get your business online professionally.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Domain registration and transfer</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>DNS configuration and management</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>VPS or cloud hosting setup</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>SSL certificate installation</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Branded email setup (name@domain.com)</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Email client configuration</span></li>
                </ul>
                <a href="https://techstudio.co.in/quote/domain-hosting-setup" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                  Request Quote
                </a>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Monthly Maintenance Plan</h3>
                <p className="text-gray-700 mb-3">
                  Ongoing maintenance, updates, security patches, backups, and monitoring to keep your infrastructure running smoothly and securely.
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Regular security updates</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Automated backup management</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Performance monitoring</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Uptime monitoring and alerts</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Minor fixes and optimizations</span></li>
                  <li className="flex items-start"><span className="text-yellow-500 mr-2">✓</span><span>Priority support</span></li>
                </ul>
                <a href="https://techstudio.co.in/quote/monthly-maintenance-plan" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                  Request Quote
                </a>
              </div>

            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits of Professional DevOps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Faster Deployments</h3>
                <p className="text-gray-600 text-sm">Automated pipelines reduce deployment time from hours to minutes, enabling rapid iteration.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Improved Reliability</h3>
                <p className="text-gray-600 text-sm">Containerization and infrastructure as code ensure consistent, reproducible deployments.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Enhanced Security</h3>
                <p className="text-gray-600 text-sm">Automated security updates, SSL certificates, and secure configuration protect your applications.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Scalability</h3>
                <p className="text-gray-600 text-sm">Container orchestration allows easy scaling to handle traffic spikes and growth.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cost Efficiency</h3>
                <p className="text-gray-600 text-sm">Optimized resource usage and automation reduce operational costs and manual effort.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Monitoring & Insights</h3>
                <p className="text-gray-600 text-sm">Real-time monitoring and alerts help identify and resolve issues before users are affected.</p>
              </div>
            </div>
          </div>

          {/* Technology Partner */}
          <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl border border-yellow-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Tech Studio</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All DevOps and infrastructure services are implemented by <a href="https://techstudio.co.in" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline font-semibold">Tech Studio</a>, our trusted technology partner with expertise in modern cloud infrastructure and DevOps practices.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Docker & Containerization</h3>
                <p className="text-gray-700 text-sm">Expert setup of Docker containers, Docker Compose, and container orchestration.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cloud Platforms</h3>
                <p className="text-gray-700 text-sm">Experience with AWS, DigitalOcean, Vercel, and other cloud providers.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">CI/CD Expertise</h3>
                <p className="text-gray-700 text-sm">GitHub Actions, GitLab CI, and automated deployment pipeline configuration.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Documentation & Training</h3>
                <p className="text-gray-700 text-sm">Complete documentation and team training on managing your infrastructure.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Modernize Your Infrastructure?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Let's build scalable, secure infrastructure for your growing business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact/" className="inline-block px-8 py-4 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-lg">
              Consult with Quantalyze
            </a>
            <a href="https://techstudio.co.in/contact" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">
              Get Technical Quote from Tech Studio
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

import { SubscribeForm } from '@/components/forms/SubscribeForm';
import { ContactForm } from '@/components/forms/ContactForm';

export default function TestEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">Email Forms Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Newsletter Subscription Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Subscribe to Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Get the latest updates and insights from Quantalyze delivered to your inbox.
            </p>
            <SubscribeForm />
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>
            <p className="text-gray-600 mb-6">
              Have a question or want to work with us? Send us a message!
            </p>
            <ContactForm />
          </div>
        </div>

        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">How to Test:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Fill out the newsletter subscription form with your name and email</li>
            <li>Check your email for the thank you message</li>
            <li>Fill out the contact form with your details and message</li>
            <li>Check the admin email (admin@quantalyze.co.in) for the draft inquiry</li>
          </ol>
          <p className="mt-4 text-sm text-blue-700">
            <strong>Note:</strong> Make sure your email configuration in .env is correct for this to work.
          </p>
        </div>
      </div>
    </div>
  );
}

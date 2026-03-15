export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-xl p-8 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using HolyEstates, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed">
              HolyEstates is a real estate platform that allows users to search, list, and 
              connect regarding properties for sale and rent in India. We provide a marketplace 
              for property owners, agents, and potential buyers/tenants.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Registration</h2>
            <p className="text-gray-600 leading-relaxed">
              To access certain features of the platform, you must register for an account. 
              You agree to provide accurate, current, and complete information during the 
              registration process and to update such information to keep it accurate, current, 
              and complete.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Property Listings</h2>
            <p className="text-gray-600 leading-relaxed">
              Users posting property listings must ensure that all information provided is 
              accurate and truthful. HolyEstates reserves the right to remove any listing 
              that violates our policies or contains false information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
            <p className="text-gray-600 leading-relaxed">
              Users are prohibited from:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-2">
              <li>Posting false or misleading information</li>
              <li>Using the platform for illegal activities</li>
              <li>Harassing or threatening other users</li>
              <li>Attempting to bypass security measures</li>
              <li>Scraping or data mining without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              HolyEstates shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use of or inability 
              to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users 
              of any material changes via email or through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              Email: support@holyestates.com
              <br />
              Phone: +91 1800-123-4567
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

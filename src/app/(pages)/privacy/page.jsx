import { Metadata } from 'next';

export const metadata = {
  title: 'Privacy Policy | Drawing Gallery',
  description: 'Learn about how we collect, use, and protect your personal information when you use Drawing Gallery.',
  keywords: 'privacy policy, data protection, user privacy, personal information, cookies policy',
  openGraph: {
    title: 'Privacy Policy | Drawing Gallery',
    description: 'Learn about how we collect, use, and protect your personal information when you use Drawing Gallery.',
    type: 'website',
    locale: 'en_US'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen mainbg">
      <div className="container mx-auto px-4 py-8 max-w-4xl bg-gradient-to-br from-red-50 via-white to-orange-50">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-600">
              Drawing Gallery ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information that you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Create an account</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us</li>
              <li>Download our resources</li>
            </ul>
            <p className="text-gray-600">
              This information may include your name, email address, and any other information you choose to provide.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Provide and maintain our services</li>
              <li>Send you updates and newsletters</li>
              <li>Respond to your comments and questions</li>
              <li>Improve our website and user experience</li>
              <li>Monitor usage of our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-gray-600">
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to our use of your information</li>
              <li>Withdraw consent where applicable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children's Privacy</h2>
            <p className="text-gray-600">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
              <p className="text-gray-600">Email: ninjagamer5056@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
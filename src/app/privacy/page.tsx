// /app/privacy/page.tsx
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="flex justify-center-safe">
      <div className="min-h-screen w-full max-w-3xl py-10 px-10">
        <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>

        <div className="space-y-4 text-lg">
          <p>Last updated: Oct. 31, 2025</p>

          <h2 className="text-2xl font-semibold pt-4">Introduction</h2>
          <p>Your privacy is of utmost importance to us. This Privacy Policy outlines the types of information we handle and our commitment to protecting your data.</p>

          <h2 className="text-2xl font-semibold pt-4">1. No Personal Information Collected</h2>
          <p>We do not collect, store, or have access to any personal and sensitive information you enter on FPS2.me. This includes, but is not limited to, your FPS ID, mobile number, email address, or transaction amounts.</p>
          <p>All QR code generation is performed entirely on your device within your web browser (client-side). The information you provide never leaves your device and is never sent to our servers or any third party.</p>

          <h2 className="text-2xl font-semibold pt-4">2. Website Analytics</h2>
          <p>We use a self-hosted instance of Plausible Analytics to gather anonymous usage data. Plausible is a privacy-focused analytics tool that helps us understand our website traffic without collecting any personal data.</p>
          <p>The information collected is aggregated and anonymized. It includes:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Pages visited</li>
            <li>Country of origin</li>
            <li>Browser and operating system type</li>
            <li>Device type (desktop, mobile, tablet)</li>
          </ul>
          <p>This data is used solely for statistical purposes to improve our Service. It cannot be used to identify you personally.</p>

          <h2 className="text-2xl font-semibold pt-4">3. Cookies</h2>
          <p>We do not use cookies. Plausible Analytics is configured to be cookie-free.</p>

          <h2 className="text-2xl font-semibold pt-4">4. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

          <h2 className="text-2xl font-semibold pt-4">5. Contact Us</h2>
          <a>If you have any questions about this Privacy Policy, you can contact us at: </a> <Link href="mailto:privacy@fps2.me" className="hover:underline">privacy@fps2.me</Link>
        </div>
      </div>
    </main>
  );
}

// /app/terms/page.tsx

export default function TermsPage() {
  return (
    <main className="flex justify-center-safe">
      <div className="min-h-screen w-full max-w-3xl py-10 px-10">
        <h1 className="text-3xl font-semibold mb-6">Terms of Service</h1>
        
        <div className="space-y-4 text-lg">
          <p>Last updated: Oct. 31, 2025</p>

          <h2 className="text-2xl font-semibold pt-4">1. Acceptance of Terms</h2>
          <p>By accessing and using FPS2.me (the &ldquo;Service&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this Service.</p>

          <h2 className="text-2xl font-semibold pt-4">2. Description of Service</h2>
          <p>The Service is a free-to-use, client-side tool that generates Hong Kong Faster Payment System (HKFPS) QR codes based on user-provided information. All processing is done within your web browser. No data you enter is sent to our servers.</p>

          <h2 className="text-2xl font-semibold pt-4">3. Disclaimer of Warranties</h2>
          <p>The Service is provided &ldquo;as is&ldquo; and &ldquo;as available&ldquo; without any warranties of any kind, express or implied. We do not warrant that the service will be error-free or uninterrupted.</p>

          <h2 className="text-2xl font-semibold pt-4">4. Limitation of Liability</h2>
          <p>You are solely responsible for the accuracy of the information you provide. In no event shall the owner of FPS2.me be liable for any direct, indirect, incidental, special, or consequential damages (including, but not limited to, incorrect transactions, loss of funds, or data loss) arising out of the use or inability to use the Service.</p>

          <h2 className="text-2xl font-semibold pt-4">5. Prohibited Use</h2>
          <p>You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause.</p>

          <h2 className="text-2xl font-semibold pt-4">6. Changes to the Terms</h2>
          <p>We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review this page periodically.</p>
        </div>
      </div>
    </main>
  );
}

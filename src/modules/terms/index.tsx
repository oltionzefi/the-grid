import { useNavigate } from 'react-router';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@heroui/react';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using The Grid application, you agree to be bound by these Terms & Conditions. If you do not agree to any part of these terms, you may not use the application.',
  },
  {
    title: '2. Use of the Application',
    body: 'The Grid is a burger ordering application intended for personal, non-commercial use. You agree to use the application only for lawful purposes and in a manner that does not infringe the rights of others.',
  },
  {
    title: '3. Orders & Payments',
    body: 'All orders placed through The Grid are subject to acceptance and availability. Prices are displayed in the app and may change without prior notice. You are responsible for all charges incurred under your account.',
  },
  {
    title: '4. Location Data',
    body: 'If you enable location access, The Grid uses your device location solely to identify your nearest pickup point. Location data is processed on-device and is not transmitted to or stored on any external servers.',
  },
  {
    title: '5. Privacy',
    body: 'We respect your privacy. Personal information you provide is used only to process your orders and improve your experience. We do not sell, trade, or transfer your personal information to third parties without your consent.',
  },
  {
    title: '6. Intellectual Property',
    body: 'All content, branding, and materials in The Grid — including logos, images, and text — are the property of The Grid and its licensors. You may not reproduce or redistribute any content without prior written permission.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'The Grid is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the application.',
  },
  {
    title: '8. Changes to Terms',
    body: 'We reserve the right to update these Terms & Conditions at any time. Continued use of the application after changes constitutes acceptance of the revised terms.',
  },
  {
    title: '9. Contact',
    body: 'If you have questions about these terms, please contact us through the app or visit oltionzefi.com.',
  },
];

function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1">
      {/* Page header */}
      <div className="border-b border-border bg-surface-secondary/40 shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Button variant="ghost" size="sm" onPress={() => navigate(-1)} className="shrink-0 -ml-1">
            <ArrowLeft size={15} />
            Back
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
              <FileText size={15} className="text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Terms &amp; Conditions</h1>
              <p className="text-xs text-muted">Last updated March 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Intro callout */}
          <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-5 py-4 mb-8">
            <p className="text-sm leading-relaxed text-foreground/80">
              By using <strong>The Grid</strong>, you acknowledge that you have read, understood,
              and agree to be bound by these Terms &amp; Conditions. No further action is required
              on your part.
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-6">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="font-semibold text-sm mb-1.5">{s.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-xs text-muted text-center">
              © {new Date().getFullYear()} The Grid · All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;

"use client";

import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Term() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check cookies for jwt_token and email_verified
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt_token="));
    const isVerified = document.cookie
      .split("; ")
      .find((row) => row.startsWith("email_verified="));

    // Check if token and email_verified are valid
    if (token && isVerified && isVerified.split("=")[1] === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Responsive with mobile menu */}
      <nav className="fixed w-full bg-primary/12 text-primary backdrop-blur-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={"/"}>
              <div className="flex items-center">
                <Brain className="h-6 w-6 sm:h-7 sm:w-7 lg:h-7 lg:w-7" />
                <span className="ml-2 text-base sm:text-lg lg:text-lg font-bold">
                  ReportRx
                </span>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {/* <a
                href="#features"
                className="text-foreground/80 hover:text-foreground transition-colors text-sm lg:text-sm"
              >
                Features
              </a> */}
              <Link
                href="/#features"
                className="text-foreground/80 hover:text-foreground transition-colors text-sm lg:text-sm"
              >
                Features
              </Link>

              <Link
                href="/#technology"
                className="text-foreground/80 hover:text-foreground transition-colors text-sm lg:text-sm"
              >
                Technology
              </Link>

              <Link
                href="/#solutions"
                className="text-foreground/80 hover:text-foreground transition-colors text-sm lg:text-sm"
              >
                Solutions
              </Link>

              <Link
                href="/#pricing"
                className="text-foreground/80 hover:text-foreground transition-colors text-sm lg:text-sm"
              >
                Pricing
              </Link>
              <Link
                href="/#contact"
                className="text-foreground/80 hover:text-foreground transition-colors text-sm lg:text-sm"
              >
                Contact
              </Link>

              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="sm" className="hidden sm:inline-flex">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu - slides in when toggled */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-b">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {/* <a
                href="#features"
                className="block px-3 py-2 text-foreground/80 hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a> */}
              <Link
                href="/#features"
                className="block px-3 py-2 text-foreground/80 hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#technology"
                className="block px-3 py-2 text-foreground/80 hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Technology
              </Link>
              <Link
                href="/#solutions"
                className="block px-3 py-2 text-foreground/80 hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                href="/#pricing"
                className="block px-3 py-2 text-foreground/80 hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/#contact"
                className="block px-3 py-2 text-foreground/80 hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 py-2">
                <Link href="/signup">
                  <Button
                    className="w-full mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-lg shadow-sm p-6 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            Terms and Conditions
          </h1>
          <p className="text-sm text-muted-foreground mb-8 text-center">
            Last Updated: May 1, 2025
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-foreground/90">
                Welcome to ReportRx Assistant ("Service", "we", "us", or "our").
                By accessing or using our Service, you agree to be bound by
                these Terms and Conditions ("Terms"). Please read these Terms
                carefully before using the Service.
              </p>
              <p className="mt-3 text-foreground/90">
                These Terms govern your access to and use of our AI-powered
                medical information platform, including any content,
                functionality, and services offered through our website or
                mobile application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                2. Acceptance of Terms
              </h2>
              <p className="text-foreground/90">
                By registering for an account, accessing, or using our Service,
                you acknowledge that you have read, understood, and agree to be
                bound by these Terms. If you do not agree to these Terms, you
                must not access or use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                3. Service Description
              </h2>
              <p className="text-foreground/90 mb-3">
                ReportRx Assistant provides an artificial intelligence platform
                that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                <li>
                  Allows users to submit text queries about medical symptoms and
                  concerns
                </li>
                <li>Enables users to upload medical records for AI analysis</li>
                <li>
                  Generates informative responses based on submitted queries and
                  records
                </li>
                <li>
                  Creates downloadable PDF reports of AI-generated analyses
                </li>
                <li>Maintains a history of past interactions and responses</li>
                <li>Stores uploaded medical records for future reference</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                4. Free Trial Account
              </h2>
              <h3 className="font-medium mb-2">4.1 Trial Period</h3>
              <p className="text-foreground/90 mb-3">
                Upon registration, new users receive a free account valid for
                one (1) month from the date of registration.
              </p>

              <h3 className="font-medium mb-2">4.2 Trial Limitations</h3>
              <p className="text-foreground/90 mb-2">
                The free trial includes:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                <li>A limited number of text queries</li>
                <li>A limited number of image/document uploads</li>
                <li>Access to all core features of the Service</li>
                <li>PDF generation and download capabilities</li>
                <li>History tracking and record storage</li>
              </ul>

              <h3 className="font-medium mt-3 mb-2">4.3 Trial Termination</h3>
              <p className="text-foreground/90">
                We reserve the right to terminate any free trial at our
                discretion, with or without notice, particularly in cases of
                Terms violation or suspected abuse of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. User Accounts</h2>
              <h3 className="font-medium mb-2">5.1 Registration</h3>
              <p className="text-foreground/90 mb-3">
                To use our Service, you must register an account by providing
                certain information as prompted by the registration form. You
                agree that all information you provide is accurate, complete,
                and current.
              </p>

              <h3 className="font-medium mb-2">5.2 Account Security</h3>
              <p className="text-foreground/90 mb-2">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>
                  Notifying us immediately of any unauthorized access or
                  security breach
                </li>
              </ul>

              <h3 className="font-medium mt-3 mb-2">
                5.3 Account Restrictions
              </h3>
              <p className="text-foreground/90 mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                <li>Create multiple accounts for the same individual</li>
                <li>Share your account with any third party</li>
                <li>
                  Sell, transfer, or license your account to another person
                </li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                6. Medical Disclaimer
              </h2>
              <h3 className="font-medium mb-2">6.1 Not Medical Advice</h3>
              <p className="text-foreground/90 mb-3">
                ReportRx Assistant is an informational tool only and does not
                provide medical advice, diagnosis, or treatment. The Service is
                not intended to replace professional medical advice, diagnosis,
                or treatment from a qualified healthcare provider.
              </p>

              <h3 className="font-medium mb-2">
                6.2 No Doctor-Patient Relationship
              </h3>
              <p className="text-foreground/90 mb-3">
                Use of the Service does not create a doctor-patient relationship
                between you and ReportRx Assistant, our team, or our AI
                technology.
              </p>

              <h3 className="font-medium mb-2">6.3 Emergency Situations</h3>
              <p className="text-foreground/90">
                The Service is not designed for emergency situations. For
                medical emergencies, please call your local emergency services
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                7. User Content and Uploads
              </h2>
              <h3 className="font-medium mb-2">7.1 Content License</h3>
              <p className="text-foreground/90 mb-3">
                By uploading medical records, images, or other content ("User
                Content") to the Service, you grant us a non-exclusive,
                worldwide, royalty-free license to use, store, process, and
                analyze such User Content solely for the purpose of providing
                and improving the Service.
              </p>

              <h3 className="font-medium mb-2">7.2 Content Responsibility</h3>
              <p className="text-foreground/90 mb-2">
                You are solely responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                <li>All User Content you upload to the Service</li>
                <li>
                  Ensuring you have all necessary rights to upload and share
                  such content
                </li>
                <li>The accuracy and legitimacy of all uploaded materials</li>
              </ul>

              <h3 className="font-medium mt-3 mb-2">7.3 Prohibited Content</h3>
              <p className="text-foreground/90 mb-2">
                You agree not to upload content that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                <li>Infringes on intellectual property rights</li>
                <li>Contains malware or harmful code</li>
                <li>Violates any applicable law or regulation</li>
                <li>
                  Contains personally identifiable information of others without
                  authorization
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                8. Data Privacy and Security
              </h2>
              <h3 className="font-medium mb-2">8.1 Privacy Policy</h3>
              <p className="text-foreground/90 mb-3">
                Your use of the Service is subject to our Privacy Policy, which
                is incorporated by reference into these Terms. Please review our
                Privacy Policy for information on how we collect, use, and
                disclose information about you.
              </p>

              <h3 className="font-medium mb-2">
                8.2 Medical Information Security
              </h3>
              <p className="text-foreground/90 mb-3">
                We implement reasonable security measures to protect your
                medical information. However, no method of transmission or
                storage is 100% secure. We cannot guarantee absolute security of
                your data.
              </p>

              <h3 className="font-medium mb-2">8.3 Data Retention</h3>
              <p className="text-foreground/90">
                We retain your User Content and interaction history for as long
                as your account remains active, or as needed to provide you with
                the Service, comply with legal obligations, resolve disputes, or
                enforce our agreements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                9. Intellectual Property
              </h2>
              <h3 className="font-medium mb-2">9.1 Service Ownership</h3>
              <p className="text-foreground/90 mb-3">
                The Service, including all content, features, and functionality,
                is owned by ReportRx Assistant and is protected by copyright,
                trademark, and other intellectual property laws.
              </p>

              <h3 className="font-medium mb-2">9.2 AI-Generated Content</h3>
              <p className="text-foreground/90 mb-3">
                The responses, analyses, and PDFs generated by our AI are owned
                by ReportRx Assistant. However, you receive a personal,
                non-exclusive license to use, download, and share the
                AI-generated responses and PDFs created from your specific
                queries for personal and non-commercial purposes.
              </p>

              <h3 className="font-medium mb-2">9.3 Restrictions</h3>
              <p className="text-foreground/90 mb-2">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 text-foreground/90">
                <li>
                  Modify, adapt, or create derivative works based on our Service
                </li>
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>
                  Remove any copyright or proprietary notices from the Service
                </li>
                <li>
                  Use the Service to develop competing products or services
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                10. Subscription and Billing
              </h2>
              <h3 className="font-medium mb-2">10.1 Post-Trial Subscription</h3>
              <p className="text-foreground/90 mb-3">
                After the free trial period ends, continued use of the Service
                requires a paid subscription according to our then-current
                pricing.
              </p>

              <h3 className="font-medium mb-2">10.2 Payment Terms</h3>
              <p className="text-foreground/90 mb-3">
                By providing payment information, you represent that you are
                authorized to use the payment method and agree to be charged the
                applicable subscription fees.
              </p>

              <h3 className="font-medium mb-2">10.3 Refunds</h3>
              <p className="text-foreground/90">
                Refunds are provided in accordance with our Refund Policy and
                applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Termination</h2>
              <p className="text-foreground/90">
                We may terminate or suspend your account and access to the
                Service immediately for violations of these Terms, for any other
                reason at our sole discretion, or with notice when reasonably
                possible. You may terminate your account at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                12. Limitation of Liability
              </h2>
              <p className="text-foreground/90">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW,
                ReportRx ASSISTANT SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                13. Indemnification
              </h2>
              <p className="text-foreground/90">
                You agree to defend, indemnify, and hold harmless ReportRx
                Assistant from claims arising out of or relating to your
                violation of these Terms or your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                14. Modification of Terms
              </h2>
              <p className="text-foreground/90">
                We reserve the right to modify these Terms at any time. We will
                notify users of any material changes by posting the new Terms
                and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                15. Governing Law and Jurisdiction
              </h2>
              <p className="text-foreground/90">
                These Terms shall be governed by and construed in accordance
                with the laws of the Indian government, without regard to its
                conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                16. Contact Information
              </h2>
              <p className="text-foreground/90 mb-3">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <div className="text-foreground/90">
                <p>Email: support@ReportRxassistant.com</p>
                <p>Address: We work remote</p>
                <p>Support Portal: Account Page → Submit Report</p>
              </div>
            </section>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
              <p className="text-center text-foreground/80 text-sm">
                By using ReportRx Assistant, you acknowledge that you have read
                these Terms and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - FIXED ALIGNMENT */}
      <footer className="bg-muted/50 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center mb-3">
                <Brain className="h-5 w-5 text-primary" />
                <span className="ml-2 text-base font-bold">ReportRx</span>
              </div>
              <p className="text-sm text-foreground/80">
                Advancing healthcare through artificial intelligence and machine
                learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Solutions</h4>
              <ul className="space-y-2">
                <li>
                  {/* <a
                    href="#features"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    Features
                  </a> */}
                  <Link
                    href="/#features"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#technology"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    Technology
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#research"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    Research
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/#hero"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    About us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/#blog"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/term-and-condition"
                    className="text-sm text-foreground/80 hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-foreground/60">
            <p>
              ReportRx provides AI-assisted analysis but does not replace
              professional medical judgment. Always consult healthcare
              professionals for medical decisions.
            </p>
            <p className="mt-2">© 2025 ReportRx. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

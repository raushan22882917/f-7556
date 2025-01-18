import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const PolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors">
      <Navbar />

      <div className="max-w-4xl mx-auto  shadow-md rounded-lg p-8 transition-colors">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
          Last Updated: January 16, 2025
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Introduction
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Welcome to our platform. Your privacy is important to us, and this
            policy explains how we collect, use, and safeguard your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone
              number.
            </li>
            <li>
              <strong>Usage Data:</strong> How you use our platform, including
              pages visited and interactions.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We use your information to provide and improve our services,
            communicate with you, and ensure the security of our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            You have the right to access, update, and delete your personal
            information. Please contact us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-500 dark:text-blue-400 underline"
            >
              support@example.com
            </a>{" "}
            to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            If you have any questions about this Privacy Policy, you can contact
            us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-500 dark:text-blue-400 underline"
            >
              support@example.com
            </a>
            .
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PolicyPage;

import React from "react";
import { Check, Layout, Trophy, CreditCard } from "lucide-react";

const PricingPage = () => {
  const features = [
    "Task & Journaling",
    "Daily Email Digest",
    "Entry Search",
    "Upload any File Type",
    "Export Historical Tasks",
    "Comments / Likes / Shares",
    "End-to-end encryption / security",
    "Multi-language support",
    "Groups / Categories / #tags",
    "Team Set-up",
    "Team Productivity Reporting",
    "User Roles / Permissions",
    "Integrations",
    "24/7 Customer Support",
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Centered Heading Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-6xl font-extrabold text-black mb-6 tracking-tight">
          Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that works best for your team’s productivity.
        </p>
      </section>
      <section className="bg-[#1a2b3c] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl p-10 md:p-14">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black tracking-tight">
                FREE
              </h2>
              <p className="text-gray-600 text-sm mt-1">14-day Free Trial</p>
            </div>
            <div className="flex flex-wrap gap-8 py-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm font-bold text-black">
                <Layout size={18} strokeWidth={2.5} />
                <span>Easy Set-up</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-black">
                <Trophy size={18} strokeWidth={2.5} />
                <span>Get More Done</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-black">
                <CreditCard size={18} strokeWidth={2.5} />
                <span>No Credit Card</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 py-8 border-t border-gray-100">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check size={18} className="text-gray-400" strokeWidth={3} />
                  <span className="text-[15px] text-gray-800 font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-6">
              <button className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-black py-5 rounded-md transition-all text-xl uppercase tracking-tight">
                Get started
              </button>
            </div>
          </div>

          {/* Bottom Trust Note */}
          <p className="text-center text-gray-400 text-sm mt-8">
            Trusted by teams at Gartner, Accenture, and thousands more.
          </p>
        </div>
      </section>

      {/* FAQ / Simple Contact Section */}
      <section className="py-20 text-center bg-white">
        <h3 className="text-2xl font-bold mb-4">
          Have questions about our plans?
        </h3>
        <p className="text-gray-600">
          Contact our support team at{" "}
          <a
            href="mailto:help@idonethis.com"
            className="text-orange-600 underline font-bold"
          >
            help@idonethis.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default PricingPage;

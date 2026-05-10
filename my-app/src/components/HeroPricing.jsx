import React from "react";
import { Check, Layout, Trophy, CreditCard } from "lucide-react";

export default function HeroPricing() {
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
    <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 w-full max-w-4xl mx-auto border border-gray-100">
      {/* Plan Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black tracking-tight uppercase">
          FREE
        </h2>
        <p className="text-gray-600 text-sm mt-1 tracking-wide">
          14-day Free Trial
        </p>
      </div>
      {/* Value Icons */}
      <div className="flex flex-wrap gap-6 md:gap-8 py-5 border-t border-gray-100">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 py-6 border-t border-gray-100">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <Check size={16} className="text-gray-400" strokeWidth={3} />
            <span className="text-[14px] text-gray-700 font-medium">
              {feature}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button className="w-full bg-[#ff0000] hover:bg-red-700 text-white font-black py-4 rounded-md transition-all text-lg uppercase tracking-tight active:scale-[0.98]">
          Get started
        </button>
      </div>
    </div>
  );
}

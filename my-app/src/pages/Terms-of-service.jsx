import React from "react";

const TermsOfService = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto text-gray-800 leading-relaxed font-sans">
        <h1 className="text-4xl font-bold text-center mb-12 text-black">
          I Done This - Terms of Service
        </h1>
        <div className="space-y-10">
          <section>
            <h2 className="font-bold text-black uppercase mb-4 border-b border-gray-100 pb-2">
              ACCEPTANCE OF THE AGREEMENT
            </h2>
            <div className="space-y-4">
              <p>
                Please read these Terms and Conditions of Service carefully
                before registering for a free or chargeable subscription to use
                the Software and Services offered on this website operated by I
                Done This (the “Company” or “we”).
              </p>
              <p>
                By completing the online registration form and clicking on the
                accept buttons relating to these{" "}
                <a href="#" className="text-orange-600 underline">
                  Terms and Conditions of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-orange-600 underline">
                  Privacy Policy
                </a>
                , you agree to be legally bound by them, which together form the
                (“Agreement”).
              </p>
              <p>
                If you do not wish to be bound by these terms, then you may not
                use or purchase access to the Software or Services.
              </p>
            </div>
          </section>
          <section>
            <h2 className="font-bold text-black uppercase mb-4">
              SCOPE OF THE AGREEMENT
            </h2>
            <p>
              You engage the Company and the Company agrees to provide the
              Software and Services to you from the date that you complete the
              online registration form (“Effective Date”) for the term of this
              Agreement.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-black uppercase mb-4">SOFTWARE</h2>
            <p>
              IDONETHIS (the “Software”) is a web-based task management system
              with which you may collaborate with team members to effectively
              keep track of completed tasks and future goals.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-black uppercase mb-4">SERVICES</h2>
            <p>
              The services provided are related to task management and shall be
              provided partially or entirely online. You acknowledge that the
              Software is entitled to modify, improve or discontinue any of the
              Services at its sole discretion without notice.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-black uppercase mb-4 text-black">
              FEES
            </h2>
            <p className="mb-4">
              Upon expiry of the 3-day “Free Trial Period”, you shall pay a
              subscription fee (“Fee”) for continued use.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                All subscriptions automatically renew month-to-month or
                year-to-year.
              </li>
              <li>
                Cancellations can be requested by emailing{" "}
                <a
                  href="mailto:help@idonethis.com"
                  className="text-orange-600 underline"
                >
                  help@idonethis.com
                </a>
                .
              </li>
              <li>
                <strong>Refund Policy:</strong> We do not offer refunds. You can
                try our product for free before upgrading.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="font-bold text-black uppercase mb-4 text-black">
              PROTECTION OF INFORMATION
            </h2>
            <p>
              All information you provide to us is stored on secure servers. Any
              payment transactions will be encrypted using SSL technology. You
              are responsible for keeping your password confidential.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-black uppercase mb-4 text-black">
              DATA RETENTION
            </h2>
            <p>
              We retain personal data for as long as necessary for the relevant
              activity. After closing an account or 12 months of inactivity, we
              usually delete personal data, except where necessary for legal
              obligations.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-black uppercase mb-4 text-black">
              LIMITATION OF LIABILITY
            </h2>
            <p>
              To the maximum extent permitted by law, the Company shall in no
              event be liable for any indirect, incidental, or consequential
              damages arising out of the use or inability to use the Software or
              Services.
            </p>
          </section>
          <section>
            <h2 className="font-bold text-black uppercase mb-4 text-black">
              COMPLAINTS
            </h2>
            <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
              <p className="mb-2 italic">
                Have a concern about how your data was handled?
              </p>
              <p>
                Email us at:{" "}
                <a
                  href="mailto:help@idonethis.com"
                  className="text-orange-600 underline font-bold"
                >
                  help@idonethis.com
                </a>
              </p>
            </div>
          </section>
          <div className="pt-12 text-sm text-gray-500 text-center border-t border-gray-100">
            All contents of the Service are copyrighted © 2023 I Done This. All
            rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

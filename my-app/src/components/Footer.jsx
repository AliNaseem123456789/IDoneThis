import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-12 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Product Column */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 border-b-2 border-black inline-block pb-1">
            Product
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>
              <a href="/How%20It%20works" className="hover:text-black">
                How it Works
              </a>
            </li>
            <li>
              <a href="pricing" className="hover:text-black">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Roadmap
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                G2 Reviews
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black block">
                Capterra Reviews
              </a>
              <div className="flex items-center mt-1 text-yellow-500 text-xs">
                <span>★★★★★</span>
                <span className="text-gray-400 ml-1">(962 reviews)</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 border-b-2 border-black inline-block pb-1">
            Resources
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>
              <a href="#" className="hover:text-black">
                Blog
              </a>
            </li>
            <li>
              <a href="Productivity-Guide" className="hover:text-black">
                Guides
              </a>
            </li>
            <li>
              <a href="case-studies" className="hover:text-black">
                Case Studies
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Mentions
              </a>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 border-b-2 border-black inline-block pb-1">
            Company
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>
              <a href="PrivacyPolicy" className="hover:text-black">
                Privacy
              </a>
            </li>
            <li>
              <a href="terms-of-service" className="hover:text-black">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Support
              </a>
            </li>
            <li>
              <a href="mailto:help@idonethis.com" className="hover:text-black">
                help@idonethis.com
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-sm">
            Receive The Latest Productivity Tips
          </h3>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="john@idonethis.com"
              className="w-full px-4 py-2 bg-gray-100 border-none rounded focus:ring-2 focus:ring-blue-500 text-sm outline-none"
            />
            <button
              type="submit"
              className="w-full bg-[#1a2b3c] text-white font-bold py-3 px-4 rounded transition hover:bg-black text-sm"
            >
              Sign Up For Newsletter
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

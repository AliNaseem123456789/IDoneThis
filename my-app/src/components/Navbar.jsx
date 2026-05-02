import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      {/* Container to constrain width and center content */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
          <h1 className="font-bold text-xl tracking-tight">idontheis</h1>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/How%20It%20works"
            className="text-gray-600 font-medium hover:text-red-500 transition"
          >
            How it works
          </Link>
          <Link
            to="/pricing"
            className="text-gray-600 font-medium hover:text-red-500 transition"
          >
            Pricing
          </Link>
          <Link
            to="/case-studies"
            className="text-gray-600 font-medium hover:text-red-500 transition"
          >
            Case Studies
          </Link>
          <Link
            to="/blog"
            className="text-gray-600 font-medium hover:text-red-500 transition"
          >
            Blog
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-600 font-medium hover:text-red-500 transition"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-red-500 text-white px-5 py-2 rounded font-medium hover:bg-red-600 transition shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

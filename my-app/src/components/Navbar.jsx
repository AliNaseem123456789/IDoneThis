export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-3">
      {/* Logo - stays on left */}
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
        <h1 className="font-semibold text-lg">i done this</h1>
      </div>

      {/* Navigation - shifted towards right */}
      <div className="flex items-center space-x-6">
        <a href="/How It works" className="text-gray-900 font-medium hover:text-red-500">
          How It works
        </a>
        <a href="#Pricing" className="text-gray-900 font-medium hover:text-red-500">
          Pricing
        </a>
        <a href="#CaseStudies" className="text-gray-900 font-medium hover:text-red-500">
          Case Studies
        </a>
        <a href="#Blog" className="text-gray-900 font-medium hover:text-red-500">
          Blog
        </a>
        <a href="/login" className="text-gray-900 font-medium hover:text-red-500">
          Log in
        </a>

        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
          Get Started
        </button>
      </div>
    </nav>
  );
}

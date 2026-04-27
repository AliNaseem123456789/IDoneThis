import React, { useState } from "react";

const guidesData = [
  {
    title: "The Ultimate Guide to Remote Standups",
    bg: "bg-blue-50",
    textColor: "text-blue-900",
    content:
      "Remote standups aren't just about status updates; they are about alignment. To maximize efficiency, keep them under 15 minutes, use a 'parking lot' for side discussions, and ensure everyone has their cameras on to build rapport. Tools like 'I Done This' help keep these meetings asynchronous when time zones vary.",
  },
  {
    title: "The Comprehensive Guide to Remote Work",
    bg: "bg-orange-50",
    textColor: "text-orange-900",
    content:
      "The secret to long-term remote work success is the 'Third Space'—a mental transition between work and home. Establish a dedicated workspace, set strict 'off' hours, and prioritize over-communication. Documentation is your best friend in a distributed team.",
  },
  {
    title: "The Ultimate Guide to Management",
    bg: "bg-green-50",
    textColor: "text-green-900",
    content:
      "Modern management is moving from 'command and control' to 'coach and facilitate.' Focus on setting clear objectives (OKRs), removing blockers for your team, and providing consistent, radical candor. Your job is to make your team the best version of themselves.",
  },
  {
    title: "The Definite Guide to Content Marketing",
    bg: "bg-purple-50",
    textColor: "text-purple-900",
    content:
      "Content marketing is a marathon, not a sprint. Focus on the 'Value-First' framework: identify your audience's biggest pain points and solve them for free. Use the 80/20 rule—spend 20% of your time creating content and 80% promoting it.",
  },
  {
    title: "The Ultimate Guide to Awesome Meetings",
    bg: "bg-yellow-50",
    textColor: "text-yellow-900",
    content:
      "If a meeting doesn't have an agenda, it shouldn't happen. Awesome meetings start with a clear goal, end with actionable next steps, and only include essential participants. Try the 'silent start' method—spend the first 5 minutes reading a memo in silence before discussing.",
  },
  {
    title: "The Busy Person's Guide to the Done List",
    bg: "bg-red-50",
    textColor: "text-red-900",
    content:
      "To-do lists focus on what you haven't done, which causes anxiety. The 'Done List' focuses on achievements. By recording small wins daily, you build momentum and psychological safety. It provides a clearer picture of productivity than a list of crossed-off tasks.",
  },
];

const ProductivityGuides = () => {
  const [activeGuide, setActiveGuide] = useState(null);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-black mb-4">
          Productivity Guides
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Learn how the best people and teams maximize their productivity and
          achieve their goals.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto pb-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guidesData.map((guide, index) => (
            <button
              key={index}
              onClick={() => setActiveGuide(guide)}
              className={`${guide.bg} rounded-2xl p-10 flex flex-col justify-between text-left transition-all hover:shadow-xl hover:-translate-y-1 group border border-transparent hover:border-gray-200`}
            >
              <h2
                className={`text-2xl font-bold ${guide.textColor} leading-tight`}
              >
                {guide.title}
              </h2>
              <span
                className={`mt-8 font-bold text-sm uppercase tracking-widest border-b-2 border-current pb-1 ${guide.textColor} group-hover:opacity-60`}
              >
                Learn More
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Modal / Reading Overlay */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 md:p-12 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveGuide(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black text-2xl"
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold text-black mb-6">
              {activeGuide.title}
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p className="leading-relaxed">{activeGuide.content}</p>
            </div>
            <button
              onClick={() => setActiveGuide(null)}
              className="mt-10 w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Finish Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityGuides;

import React, { useState } from "react";
import { successStories } from "../data/case-studies";
const SuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  if (selectedStory) {
    return (
      <div className="bg-white min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-6 pt-12">
          <button
            onClick={() => setSelectedStory(null)}
            className="text-orange-600 font-bold flex items-center gap-2 hover:underline mb-8"
          >
            ← Back to Success Stories
          </button>

          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
            {selectedStory.title}
          </h1>

          <div className="flex gap-6 text-gray-500 font-medium mb-12 pb-8 border-b border-gray-100">
            <span>Team: {selectedStory.team}</span>
            <span>Dones: {selectedStory.dones}</span>
          </div>

          <div className="space-y-12 text-lg text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">
                Introduction
              </h2>
              <p>{selectedStory.intro}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Challenge</h2>
              <p>{selectedStory.challenge}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Solution</h2>
              <p>{selectedStory.solution}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Results</h2>
              <p>{selectedStory.results}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Conclusion</h2>
              <p>{selectedStory.conclusion}</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-6xl font-extrabold text-black mb-4">Customer</h1>
        <h1 className="text-6xl font-extrabold text-black">success stories</h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {successStories.map((story) => (
          <div
            key={story.id}
            className="group cursor-pointer"
            onClick={() => setSelectedStory(story)}
          >
            <div className="aspect-video overflow-hidden rounded-xl mb-4 bg-gray-100">
              <img
                src={story.image}
                alt={story.company}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="text-xl font-bold text-black leading-tight mb-3 group-hover:text-orange-600 transition-colors">
              {story.title}
            </h3>
            <button className="text-orange-600 font-bold text-sm flex items-center gap-1">
              Learn More <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;

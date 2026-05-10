import React from "react";

const reviews = [
  {
    name: "Sarah J.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sarah",
    text: "I Done This has completely changed how our engineering team handles standups. No more chasing people for updates—it's all right there in the morning digest.",
  },
  {
    name: "Marcus Chen",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=marcus",
    text: "As a creative director, I struggle with 'invisible work.' This tool helps me document the small wins that usually get forgotten by the end of the week.",
  },
  {
    name: "Elena Rodriguez",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=elena",
    text: "The email integration is the killer feature. I don't have to open another tab; I just reply to the prompt and my day is logged. Simple and effective.",
  },
  {
    name: "David K.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=david",
    text: "Finally, a productivity tool that doesn't feel like a chore. Seeing my 'Done' list grow over the month is the best motivation I've found in years.",
  },
  {
    name: "Priya Sharma",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=priya",
    text: "We use it for cross-departmental transparency. I can see what the marketing team is shipping without having to sit in on their internal meetings.",
  },
  {
    name: "Tom 'Tex' Walker",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=tom",
    text: "It's like a fitness tracker for my career. I can look back and see exactly when I hit my stride and what was blocking me during slower weeks.",
  },
  {
    name: "Jessica Lee",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=jess",
    text: "The interface is so clean. I love that it doesn't try to do too much. It does one thing—tracking progress—perfectly.",
  },
  {
    name: "Sam Benson",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=sam",
    text: "Great for remote teams. It builds a sense of shared momentum even when we're thousands of miles apart.",
  },
  {
    name: "Amara Oke",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=amara",
    text: "I use it as a personal work journal. It makes writing my end-of-year self-appraisal a 5-minute task instead of a 5-hour headache.",
  },
  {
    name: "Kevin Miller",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=kevin",
    text: "The 'Done List' philosophy is a game changer. Focusing on what was achieved rather than what's left to do has boosted our team morale significantly.",
  },
  {
    name: "Linda G.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=linda",
    text: "Easy to set up, easy to use, and the support team is actually helpful. It's rare to find software this reliable.",
  },
  {
    name: "Oscar Vance",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=oscar",
    text: "I've tried every planner and app under the sun. This is the only one I've actually stuck with for more than a month.",
  },
];

const TestimonialCard = ({ review }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 transition-all hover:shadow-md">
    <div className="flex items-center gap-3">
      <img
        src={review.avatar}
        alt={review.name}
        className="w-10 h-10 rounded-full object-cover border border-gray-100"
      />
      <div>
        <h4 className="font-bold text-gray-900 text-sm leading-none mb-1">
          {review.name}
        </h4>
        <div className="flex text-yellow-500 text-xs">
          {[...Array(5)].map((_, i) => (
            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-600 text-sm leading-relaxed italic">
      "{review.text}"
    </p>
  </div>
);

const Reviews = () => {
  return (
    <div className="bg-[#fff9f9] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Loved by teams everywhere
          </h2>
          <p className="text-gray-500">
            Join thousands of productive professionals.
          </p>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="break-inside-avoid">
              <TestimonialCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;

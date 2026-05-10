export default function Hero() {
  return (
    <section className="bg-[rgb(28,42,68)] text-white min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl font-bold mb-4">
        Get More Done
      </h1>
      <p className="text-xl mb-6 max-w-2xl">
        Unlock Your Full Potential by Journaling Your Tasks, Tracking Progress, and Celebrating Success!
      </p>
      <button className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl shadow-md hover:scale-105 transition">
        Get Started
      </button>
    </section>
  );
}

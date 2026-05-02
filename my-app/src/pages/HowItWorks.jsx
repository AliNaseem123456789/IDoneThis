import Navbar from "../components/Navbar";
import benefit2 from "../assets/ImproveEngagements.avif";
import benefit1 from "../assets/IncreaseProductivity.avif";
import benefit3 from "../assets/ReduceMeetings.avif";
import Video1 from "../assets/video.mp4";
export default function HowItWorks() {
  return (
    <>
      <section className="bg-white text-black py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How it Works</h1>
          <p className="text-xl max-w-2xl mx-auto">
            The simple way to reflect on your day and stay motivated.
          </p>
        </div>
      </section>
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <video
            src={Video1}
            controls
            className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 space-y-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <img
              src={benefit1}
              alt="Increase Productivity"
              className="w-full rounded-xl shadow-lg object-cover"
            />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Increase Productivity
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                IDoneThis is a user-friendly tool that enables you or your team
                to document daily achievements and goals, fostering a sense of
                accomplishment and accountability by sending daily email
                reminders of completed tasks and plans for the next day.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Improve Engagement
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                IDoneThis enhances engagement and perspective by enabling you
                and your team to like and comment on done reports, providing
                managers with valuable insights to gauge team sentiment.
              </p>
            </div>
            <img
              src={benefit2}
              alt="Improve Engagement"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <img
              src={benefit3}
              alt="Decrease Meetings"
              className="w-full rounded-xl shadow-lg object-cover"
            />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Reduce Meetings
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                IDoneThis minimizes the need for frequent meetings by enabling
                team members to record progress and goals, allowing others to
                catch up on everyone's status at their convenience.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm feature-card">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-book text-purple-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">Journal Log</h3>
              <p className="text-gray-600">
                Log and measure your tasks on a daily basis to achieve your
                goals
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm feature-card">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-bell text-yellow-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">Daily Reminders</h3>
              <p className="text-gray-600">
                Never forget to log your accomplishments with automatic email
                prompts
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm feature-card">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-chart-bar text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Look back on your achievements and see how far you've come
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm feature-card">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-search text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">Searchable History</h3>
              <p className="text-gray-600">
                Easily ask in natural language or use pre-defined template
                questions to better understand your productivity
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm feature-card">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-calendar-alt text-indigo-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">Calendar View</h3>
              <p className="text-gray-600">
                At-a-glance view across any timeframe to track how much you got
                done
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm feature-card">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-robot text-pink-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">AI Reports</h3>
              <p className="text-gray-600">
                Summarize historical tasks to find insights and recommendations
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-purple-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start My 14-day Free Trial
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Track Your Progress, Celebrate Your Wins
          </p>
          <a
            href="#"
            className="bg-white text-purple-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block"
          >
            Get started
          </a>
        </div>
      </section>
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    G2 Reviews
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Capterra Reviews
                  </a>
                </li>
                <li className="text-yellow-400 mt-2">
                  ⭐⭐⭐⭐⭐ (140 reviews)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Mentions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:help@idonethis.com"
                    className="text-gray-400 hover:text-white"
                  >
                    help@idonethis.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">
                Receive The Latest Productivity Tips
              </h3>
              <div className="flex mt-2">
                <input
                  type="email"
                  placeholder="john@idonethis.com"
                  className="bg-gray-700 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg transition">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 I Done This All rights reserved</p>
            <p className="mt-2">I Done This - How it Works</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .feature-card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
}

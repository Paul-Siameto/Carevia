import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const About = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-500 mb-6">
            About <span className="text-accent-500">Care-via</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Empowering your health journey with innovative technology and compassionate care.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                At Care-via, we believe that everyone deserves access to personalized health management tools that are both powerful and easy to use. 
                Our mission is to bridge the gap between professional healthcare and daily wellness by providing a comprehensive platform that helps 
                you track, understand, and improve your health.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Founded in 2025, Care-via was created by a team of healthcare professionals and technology experts who saw an opportunity to make 
                health management more accessible and effective for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Why Choose Care-via?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Comprehensive Tracking",
                description: "Monitor your health metrics, mood, medications, and symptoms all in one place.",
                icon: "📊"
              },
              {
                title: "AI-Powered Insights",
                description: "Get personalized health insights and recommendations based on your data.",
                icon: "🤖"
              },
              {
                title: "Secure & Private",
                description: "Your health data is encrypted and protected with enterprise-grade security.",
                icon: "🔒"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Meet the Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-5xl">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to take control of your health?</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of users who are already improving their wellness with Care-via.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors"
          >
            Get Started for Free
          </Link>
        </section>
      </div>
    </div>
  );
};

export default About;

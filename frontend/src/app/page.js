"use client";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [faqOpen, setFaqOpen] = useState({});

  // Smooth scrolling for navbar links
  useEffect(() => {
    const smoothScroll = (event) => {
      event.preventDefault();
      const targetId = event.target.getAttribute("href")?.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", smoothScroll);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", smoothScroll);
      });
    };
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>PayX- Simplify Your Finances</title>
        <meta
          name="description"
          content="Payx Digital Wallet - Secure and seamless financial management."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-purple-600">PayX</div>
          <nav className="space-x-4">
            <a href="#features" className="text-gray-700 hover:text-purple-600">
              Features
            </a>
            <a href="#faq" className="text-gray-700 hover:text-purple-600">
              FAQ
            </a>
            <a href="#contact" className="text-gray-700 hover:text-purple-600">
              Contact Us
            </a>
          </nav>
          <div className="flex space-x-4">
            <a
              href="/login"
              className="px-4 py-2 bg-gray-100 text-purple-600 rounded-lg hover:bg-gray-200"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>
      <section className="bg-purple-50 py-20 ">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 ">
              Simplify Your Finances with PayX
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              A secure and seamless digital wallet for effortless money
              management.
            </p>
            <p className="text-lg text-purple-600 font-medium mb-8">
              Experience the power of technology combined with user-focused
              design. PayX ensures your money is not just managed, but optimized
              for growth.
            </p>
            <div className="space-x-4">
              <a
                href="/register"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Sign Up
              </a>
              <a
                href="#features"
                className="px-6 py-3 bg-gray-100 text-purple-600 rounded-lg hover:bg-gray-200 transition duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="/main.svg"
              alt="Simplify Your Finances"
              className="w-3/4 mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
      Why Choose PayX?
    </h2>
    <div className="flex flex-col space-y-12">
      {[
        {
          title: "Instant Money Transfer",
          description: "Send and receive money securely in seconds.",
          image: "/instant-money-transfer.svg",
        },
        {
          title: "Smart Expense Tracking",
          description:
            "Analyze your spending with interactive charts and insights.",
          image: "/smart-expense-tracking.svg",
        },
        {
          title: "Personalized Recommendations",
          description:
            "Save more with tips based on your financial behavior.",
          image: "/personalized-recommendations.svg",
        },
        {
          title: "Multi-Layered Security",
          description: "Protect your data with advanced encryption.",
          image: "/multi-layered-security.svg",
        },
      ].map((feature, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
        >
          <img
            src={feature.image}
            alt={feature.title}
            className="h-40 w-40 md:mr-6 mb-6 md:mb-0"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* FAQ Section */}
<section id="faq" className="bg-gray-100 py-16">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
      Frequently Asked Questions
    </h2>
    <div className="space-y-4">
      {[
        {
          question: "Is Payx free to use?",
          answer: "Yes, Payx is completely free for personal use.",
        },
        {
          question: "How secure is Payx?",
          answer: "We use advanced encryption to keep your data safe.",
        },
        {
          question: "Does Payx support Sending money to non PayX?",
          answer: "No, to send money to your friends and family they should be registered on PayX.",
        },
        {
          question: "Does Payx support UPI transaction?",
          answer: "Currently no, but we are trying the implement UPI in our upcomming Big update that is V2.0. Stay tuned for more updates.",
        },
      ].map((faq, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition duration-300"
          onClick={() => toggleFaq(index)}
        >
          <h3 className="font-semibold text-gray-800 flex justify-between items-center">
            {faq.question}
            <span>{faqOpen[index] ? "-" : "+"}</span>
          </h3>
          <div
            className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
              faqOpen[index] ? "max-h-screen" : "max-h-0"
            }`}
          >
            <p className="text-gray-600 mt-2">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      
        {/* Footer */}

<footer id="contact" className="bg-purple-600 py-12 relative">
  <div className="container mx-auto px-4 text-center text-white space-y-4">
    <div className="absolute top-4 right-9 flex flex-col items-end space-y-6">
      <div className="flex space-x-5">
        <a href="https://github.com/sy-mansoor/" className="hover:underline" target="_blank">
          <img
            src="/github-icon.svg"
            alt="GitHub"
            className="h-6 w-6 text-white"
          />
        </a>
        <a href="https://www.linkedin.com/in/symansoor/" className="hover:underline" target="_blank">
          <img
            src="/linkedin-icon.svg"
            alt="LinkedIn"
            className="h-6 w-6 text-white"
          />
        </a>
        <a href="https://www.instagram.com/_syed.mansoor/" className="hover:underline" target="_blank">
          <img
            src="/instagram-icon.svg"
            alt="Instagram"
            className="h-6 w-6 text-white"
          />
        </a>
      </div>
      <a
        href="mailto:support@payx.com"
        className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition duration-300"
      >
        Contact Us
      </a>
    </div>
    <p>© 2025 Payx. All Rights Reserved.</p>
    <p>Contact: support@payx.com | +1 234 567 890</p>
    <div className="flex justify-center space-x-4">
      <a href="https://github.com/sy-mansoor/Digital-Payment-Wallet/" className="hover:underline" target="_blank">
        Privacy Policy
      </a>
      <a href="https://github.com/sy-mansoor/Digital-Payment-Wallet/" className="hover:underline" target="_blank">
        Terms of Service
      </a>
    </div>
  </div>
</footer>
    </div>
  ); 

}
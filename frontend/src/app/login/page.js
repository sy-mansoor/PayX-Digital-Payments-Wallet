"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "../components/ui/loader";  // Import your loader component
import "../globals.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false); // State to control loading animation
  const router = useRouter();
  const [error, setError] = useState(null);
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true); // Show loader when the form is being submitted
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      toast.success("Logged in successfully!");
      router.push("/Dashboard");
    } catch (error) {
      toast.error("Login failed. Check your credentials.");
    } finally {
      setIsLoading(false); // Hide loader after the request is done
    }
  };

  return (
    <div className="min-h-screen bg-custom-gray flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="md:flex">
          
          <div className="md:w-1/2 bg-purple-50 p-6 flex justify-center items-center">
            <img src="/login-illustration.svg" alt="Login Illustration" className="w-3/4" />
          </div>
          
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-600 mb-4 text-center">Welcome Back</h2>
            <p className="text-gray-600 text-center mb-6">Login to manage your finances effortlessly.</p>
            
            {/* Show the loader if isLoading is true */}
            {isLoading && <Loader />}  {/* Render your loader here */}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  onChange={handleChange}
                  /* pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  title="Enter a valid email address" */
                  required

                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Login
              </button>
              <p className="text-center text-gray-600 mt-4">
                Don't have an account?{' '}
                <a href="/register" className="text-purple-600 hover:underline">
                  Sign Up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
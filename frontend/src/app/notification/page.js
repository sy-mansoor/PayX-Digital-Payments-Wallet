"use client";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Activity, ArrowLeft, CheckCircle, XCircle} from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state for loading
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "x-auth-token": token };
        const response = await axios.get(
          "http://localhost:5000/api/transactions/notifications",
          { headers }
        );
        setNotifications(response.data);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          // Handle specific error messages from the server
          error.response.data.errors.forEach((errorMessage) => {
            toast.error(errorMessage); // Display each error message
          });
        } else {
          // Handle generic errors
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "x-auth-token": token };
      const response = await axios.post(
        `http://localhost:5000/api/transactions/notifications/${notificationId}/accept`,
        {},
        { headers }
      );
      toast.success(response.data.msg);
      router.refresh(); // Refresh the data
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Handle specific error messages from the server
        error.response.data.errors.forEach((errorMessage) => {
          toast.error(errorMessage); // Display each error message
        });
      } else {
        // Handle generic errors
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleReject = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "x-auth-token": token };
      const response = await axios.post(
        `http://localhost:5000/api/transactions/notifications/${notificationId}/reject`,
        {},{ headers }
      );
      toast.success(response.data.msg);
      router.refresh(); // Refresh the data
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Handle specific error messages from the server
        error.response.data.errors.forEach((errorMessage) => {
          toast.error(errorMessage); // Display each error message
        });
      } else {
        // Handle generic errors
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <a href="/Dashboard" className="flex items-center text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </a>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6">
          Notifications
        </h1>

        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <Activity className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications found.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification, index) => (
              <li
                key={notification._id}
                className={`bg-white p-6 rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl ${
                  index % 2 === 0
                    ? "animate__animated animate__fadeIn animate__delay-300ms"
                    : "animate__animated animate__fadeIn animate__delay-500ms"
                }`}
              >
                <div className="flex items-start mb-4">
                  {notification.type === "request" && (
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  )}
                  {notification.type === "alert" && (
                    <XCircle className="w-6 h-6 text-red-500 mr-3" />
                  )}
                  <p className="text-gray-800 text-lg">{notification.message}</p>
                </div>

                {notification.type === "request" && notification.status === "pending" && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleAccept(notification._id)}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(notification._id)}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {notification.status !== "pending" && (
                  <p className="mt-2 text-sm text-gray-500">Status: {notification.status}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

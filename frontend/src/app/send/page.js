'use client'
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { ArrowLeft, SendHorizontal, Shield, Zap } from "lucide-react";
import { Activity } from "lucide-react";

const SendMoney = () => {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    amount: "",
    note: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [animateCards, setAnimateCards] = useState(false); // New state for animating cards
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const headers = { "x-auth-token": token };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/transactions/send",
        {
          recipientEmail: formData.recipientEmail,
          amount: Number(formData.amount),
          note: formData.note
        },
        { headers }
      );
      toast.success(response.data.msg);
      router.push("/Dashboard");
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((errorMessage) => {
          toast.error(errorMessage);
        });
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Set animation trigger when component mounts
 

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <a href="/Dashboard" className="flex items-center text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </a>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-purple-600">Send Money</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 ${animateCards ? "animate__animated animate__fadeIn animate__delay-500ms" : ""}`}>
              {[ 
                { icon: <SendHorizontal className="w-6 h-6 text-purple-500" />, title: "Instant Transfer", desc: "Send money instantly" },
                { icon: <Shield className="w-6 h-6 text-purple-500" />, title: "Secure", desc: "Multi-Layered Security" },
                { icon: <Zap className="w-6 h-6 text-purple-500" />, title: "Zero Fees", desc: "No transaction fees" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-4 transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-purple-100 rounded-lg"
                >
                  <div className="flex justify-center mb-2">{item.icon}</div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                type="email"
                name="recipientEmail"
                id="recipientEmail"
                value={formData.recipientEmail}
                placeholder="name@example.com"
                onChange={handleChange}
                required={true}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                label="Recipient Email"
              />
              
              <FormInput
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                placeholder="0.00"
                onChange={handleChange}
                required={true}
                min="0"
                label="Amount ($)"
              />

              <FormInput
                type="text"
                name="note"
                id="note"
                value={formData.note}
                placeholder="Add a note (optional)"
                onChange={handleChange}
                label="Note"
              />

              <FormButton
                type="submit"
                label={isLoading ? "Sending..." : "Send Money"}
                disabled={isLoading}
                className="w-full"
              />
            </form>

            <p className="text-xs text-gray-500 mt-6 text-center">
              By sending money, you agree to our terms of service and policies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center absolute inset-0 bg-white bg-opacity-50 z-10">
          <Activity className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default SendMoney;

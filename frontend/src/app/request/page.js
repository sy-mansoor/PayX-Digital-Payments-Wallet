'use client'
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { ArrowLeft, DollarSign, Mail, Clock } from "lucide-react";

const RequestMoney = () => {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    amount: "",
    note: ""
  });
  const [isLoading, setIsLoading] = useState(false);

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
        "http://localhost:5000/api/transactions/request",
        {
          recipientEmail: formData.recipientEmail,
          amount: Number(formData.amount),
          note: formData.note
        },
        { headers }
      );
      toast.success(response.data.msg);
      setFormData({ recipientEmail: "", amount: "", note: "" });
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

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <a href="/Dashboard" className="flex items-center text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </a>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-purple-600">Request Money</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Mail className="w-6 h-6 text-purple-500" />, title: "Easy Request", desc: "Request money from any PayX user" },
                { icon: <DollarSign className="w-6 h-6 text-purple-500" />, title: "Any Amount", desc: "No minimum amount required" },
                { icon: <Clock className="w-6 h-6 text-purple-500" />, title: "Quick Process", desc: "Instant notification to recipient" }
              ].map((item, index) => (
                <div key={index} className="text-center p-4">
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
                label={isLoading ? "Requesting..." : "Request Money"}
                disabled={isLoading}
                className="w-full"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestMoney;
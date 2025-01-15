'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Send, PlusCircle, Settings, LogOut, Search,CreditCard, Users, TrendingUp, TrendingDown, Activity, DollarSign, Bell } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';



const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [moneySent, setMoneySent] = useState(0);
  const [moneyReceived, setMoneyReceived] = useState(0);
  const [moneyRequested, setMoneyRequested] = useState(0);
  const [moneyReceivedToday, setMoneyReceivedToday] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    todayTransactions: [],
    weeklyTransactions: [],
    monthlyTransactions: [],
  });
  const router = useRouter();

  // Custom svg background pattern
  const PatternBackground = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <svg className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2" aria-hidden="true">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse" x="50%" y="100%">
            <path d="M0 32V.5H32" fill="none" stroke="rgba(124,58,237,0.1)"></path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"></rect>
      </svg>
    </div>
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const headers = { "x-auth-token": token };
        const userResponse = await axios.get("http://localhost:5000/api/auth/user", { headers });
        setUser(userResponse.data);

        const balanceResponse = await axios.get("http://localhost:5000/api/transactions/balance", { headers });
        setBalance(balanceResponse.data.balance);

        const transactionResponse = await axios.get("http://localhost:5000/api/transactions", { headers });
        const transactions = transactionResponse.data;
        setTransactions(transactions);
        calculateTransactionMetrics(transactions);



        
        // Simulate notifications
        setNotifications([
          { id: 1, message: "You received $50 from John Doe", time: "2 minutes ago" },
          { id: 2, message: "Payment request from Jane Smith", time: "1 hour ago" },
        ]);
      } catch (error) {
        toast.error("Please login again");
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  const calculateTransactionMetrics = (transactions) => {
    let sent = 0, received = 0, requested = 0, receivedToday = 0;
    const monthData = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "credit") {
        received += transaction.amount;
        if (new Date(transaction.date).toDateString() === new Date().toDateString()) {
          receivedToday += transaction.amount;
        }
      } else if (transaction.type === "debit") {
        sent += transaction.amount;
      }

      const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
      if (!monthData[month]) monthData[month] = 0;
      monthData[month] += transaction.amount;
    });

    const chartData = Object.keys(monthData).map(month => ({
      name: month,
      amount: monthData[month],
    }));

    setMoneySent(sent);
    setMoneyReceived(received);
    setMoneyRequested(requested);
    setMoneyReceivedToday(receivedToday);
    setChartData(chartData);
  };

  const StatCard = ({ title, amount, icon: Icon, trend }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
    >
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-purple-50 to-transparent" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-purple-600">${amount}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-purple-100 rounded-lg">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </motion.div>
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully!");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

 
  return (
    <div className="min-h-screen bg-purple-50 flex relative">
      <PatternBackground />
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        className="w-64 bg-white shadow-lg fixed inset-y-0 left-0 z-50 lg:translate-x-0"
      >
        <div className="p-6 flex items-center">
          <DollarSign className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-600 ml-2">PayX</h2>
        </div>
        <nav className="mt-8 px-4">
          <Link href="/dashboard">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center space-x-3 p-3 rounded-lg bg-purple-100 text-purple-600"
            >
              <Users className="w-5 h-5" />
              <span>Dashboard</span>
            </motion.div>
          </Link>
          
          {[
            { href: '/send', icon: Send, label: 'Send Money' },
            { href: '/request', icon: PlusCircle, label: 'Request Money' },
            { href: '/transaction', icon: CreditCard, label: 'Transactions' },
            { href: '/notification', icon: Bell, label: 'Notifications' },
            { href: '/profile', icon: Settings, label: 'Profile' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors mt-2"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          ))}
          
          <motion.button
            whileHover={{ x: 5 }}
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors w-full mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-64 p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
            <p className="text-gray-500">Here's what's happening with your account today.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-600 focus:outline-none w-64"
              />
            </div>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </motion.button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/profile">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="/default-avatar.svg"
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Balance" amount={balance} icon={DollarSign} trend={2.5} />
          <StatCard title="Money Sent" amount={moneySent} icon={Send} trend={-1.2} />
          <StatCard title="Money Received" amount={moneyReceived} icon={TrendingUp} trend={3.7} />
          <StatCard title="Money Requested" amount={moneyRequested} icon={PlusCircle} trend={0.8} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2"/>

                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <motion.div
                    key={transaction._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === "credit" 
                          ? "bg-green-100" 
                          : "bg-red-100"
                      }`}>
                        {transaction.type === "credit" ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`font-medium ${
                      transaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Floating Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-8 right-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            <PlusCircle className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
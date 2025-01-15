"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Edit, LogOut, Shield, Mail, Phone, MapPin, Activity, DollarSign, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ProfileAvatar from "../components/ui/profile-avatar";
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const headers = { "x-auth-token": token };
        const userResponse = await axios.get("http://localhost:5000/api/auth/user", {headers} );
        setUser(userResponse.data);
      } catch (error) {
        toast.error("Error fetching user data. Please login again.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully!");
  }, [router]);

  const handleEditProfile = useCallback(() => {
    router.push("/profile/edit");
  }, [router]);

  const profileSections = useMemo(() => [
    { icon: <Mail className="w-5 h-5 text-purple-500" />, label: "Email", value: user?.email },
    { icon: <Phone className="w-5 h-5 text-purple-500" />, label: "Phone", value: user?.phone },
    { icon: <MapPin className="w-5 h-5 text-purple-500" />, label: "Address", value: user?.address },
  ], [user]);

  const PatternBackground = React.memo(() => (
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
  ));

  if (isLoading || !user) return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
  );

  return (
      <div className="bg-purple-50 p-4 relative">
        <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4 relative">


          <PatternBackground/>
          <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5}}
              className="bg-white shadow-lg w-full max-w-4xl"
          >
            <div className="bg-purple-50  flex items-center">
              <a href="/Dashboard"
                 className=" bg-purple-50 flex items-center text-purple-600 hover:text-purple-700 mb-6 ">
                <ArrowLeft className="w-4 h-4 mr-2"/>
                Back to Dashboard
              </a>
            </div>
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center pb-2">
                <motion.div
                    initial={{scale: 0.9}}
                    animate={{scale: 1}}
                    transition={{duration: 0.3}}
                >
                  <div className="flex items-center justify-center mb-4">
                    <DollarSign className="w-8 h-8 text-purple-600 mr-2"/>
                    <CardTitle className="text-3xl text-purple-600">Profile Overview</CardTitle>
                  </div>
                  <p className="text-gray-600 mt-2">Manage your personal information</p>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div
                      whileHover={{y: -5}}
                      className="md:col-span-1 flex flex-col items-center p-6 bg-purple-50 rounded-lg"
                  >
                    <motion.div
                        whileHover={{scale: 1.05}}
                        transition={{type: "spring", stiffness: 300}}
                    >
                      <ProfileAvatar
                          imageUrl={user.imageUrl || "/default-avatar.svg"}
                          size="xl"
                          className="w-32 h-32 mb-4"
                      />
                    </motion.div>
                    <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
                    <p className="text-gray-600 mb-4">{user.fullName || "Full name not available"}</p>
                    <div className="w-full space-y-2">
                      <motion.button
                          whileHover={{scale: 1.02}}
                          whileTap={{scale: 0.98}}
                          onClick={handleEditProfile}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-4 h-4"/>
                        <span>Edit Profile</span>
                      </motion.button>
                      <motion.button
                          whileHover={{scale: 1.02}}
                          whileTap={{scale: 0.98}}
                          onClick={handleLogout}
                          className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition duration-300 flex items-center justify-center space-x-2"
                      >
                        <LogOut className="w-4 h-4"/>
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                  <div className="md:col-span-2 p-6">
                    <AnimatePresence>
                      <div className="grid gap-6">
                        {profileSections.map((section, index) => (
                            section.value && (
                                <motion.div
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: index * 0.1}}
                                    whileHover={{scale: 1.02, translateX: 5}}
                                    key={index}
                                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300"
                                >
                                  <div className="flex-shrink-0">{section.icon}</div>
                                  <div>
                                    <p className="text-sm text-gray-600">{section.label}</p>
                                    <p className="font-medium text-gray-900">{section.value}</p>
                                  </div>
                                </motion.div>
                            )
                        ))}
                      </div>
                    </AnimatePresence>
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3}}
                        className="mt-8 p-4 bg-purple-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <Shield className="w-5 h-5 text-purple-500"/>
                        <h3 className="font-semibold text-gray-900">Security Status</h3>
                      </div>
                      <div className="space-y-2">
                        {[
                          "Two-factor authentication enabled(upcoming)",
                          "Last login: Today"
                        ].map((status, index) => (
                            <motion.div
                                key={index}
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.4 + (index * 0.1)}}
                                className="flex items-center"
                            >
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <p className="text-sm text-gray-600">{status}</p>
                            </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
  );
};

export default Profile;
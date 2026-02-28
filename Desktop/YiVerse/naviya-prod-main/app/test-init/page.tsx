"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { updateUserReadingCount, initializeExistingUsersReadingCount, cleanupExistingUsers } from "@/lib/hexagram";
import Navbar from "../components/Navbar";

export default function TestInitPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  // 检查环境变量和开发者权限
  const isAdminEnabled = process.env.NEXT_PUBLIC_ENABLE_ADMIN === 'true';
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "mcherrybb@ucla.edu";
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || "default_secret_change_this";
  
  // 多重验证：邮箱 + 密钥 + 本地环境
  const isDeveloper = user?.email === adminEmail;
  const hasValidSecret = adminSecret !== "default_secret_change_this";
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('localhost')) &&
    (window.location.port === '3000' || 
     window.location.port === '3001' || 
     window.location.port === '');

  const handleUpdateCurrentUser = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setMessage("");
      
      await updateUserReadingCount(user.uid);
      setMessage("✅ Successfully updated reading count for current user!");
    } catch (err) {
      setMessage("❌ Failed to update reading count");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAllUsers = async () => {
    try {
      setLoading(true);
      setMessage("");
      
      // 由于权限限制，暂时只更新当前用户
      // 要更新所有用户，需要修改 Firestore 安全规则
      await updateUserReadingCount(user!.uid);
      setMessage("⚠️ Due to permissions, only updated current user. To update all users, modify Firestore security rules.");
    } catch (err) {
      setMessage("❌ Failed to update reading count");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanupUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      await cleanupExistingUsers();
      setMessage("✅ Successfully cleaned up all users! Removed cityAnalysisStarted and fixed lastLogin timezone.");
    } catch (err) {
      setMessage("❌ Failed to cleanup users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 检查访问权限
  if (!isAdminEnabled || !isLocalhost || !isDeveloper || !hasValidSecret) {
    return (
      <div className="flex flex-col gap-4 min-h-screen">
        <Navbar />
        <main className="flex-1 w-full flex flex-col items-center gap-8 p-8 mt-24">
          <div className="w-full max-w-2xl">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
              <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
              <p>
                {!isAdminEnabled && "Admin access is disabled in this environment."}
                {!isLocalhost && "This page is only accessible from localhost."}
                {!isDeveloper && "This page is only accessible to developers."}
                {!hasValidSecret && "Admin secret key is not configured properly."}
              </p>
              <p className="text-sm mt-2">
                {!isLocalhost && "Current hostname: " + (typeof window !== 'undefined' ? window.location.hostname : 'unknown')}
                {!hasValidSecret && "Please set NEXT_PUBLIC_ADMIN_SECRET in your .env.local file."}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-screen">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center gap-8 p-8 mt-24">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Developer: Update Reading Count</h1>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Update Reading Count for Current User
            </h2>
            
            <p className="text-gray-600 mb-6">
              This will update your user document to include a <code className="bg-gray-100 px-2 py-1 rounded">readingCount</code> field.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleUpdateCurrentUser}
                disabled={loading || !user}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update My Reading Count"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Update Reading Count for All Users (Limited)
            </h2>
            
            <p className="text-gray-600 mb-6">
              Due to Firestore permissions, this currently only updates the current user. To update all users, modify Firestore security rules.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleUpdateAllUsers}
                disabled={loading || !user}
                className="w-full bg-gradient-to-r from-red-600 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update ALL Users Reading Count"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🧹 Clean Up User Documents
            </h2>
            
            <p className="text-gray-600 mb-6">
              This will remove the <code className="bg-gray-100 px-2 py-1 rounded">cityAnalysisStarted</code> field and fix the <code className="bg-gray-100 px-2 py-1 rounded">lastLogin</code> timezone for all users.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleCleanupUsers}
                disabled={loading || !user}
                className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Cleaning..." : "🧹 Clean Up All Users"}
              </button>
            </div>
          </div>
          
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 
"use client";

import React, { useState } from "react";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export const LoginClient: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const supabase = createClientComponentClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		if (!email || !password) {
			setError("Please fill in all fields");
			setLoading(false);
			return;
		}

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
		} else {
			router.push("/dashboard");
			router.refresh();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
					<div className="text-center mb-8">
						<div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<Lock className="w-8 h-8 text-white" />
						</div>
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							تسجيل الدخول إلى لوحة التحكم
						</h1>
						<p className="text-gray-600">
							عناصر التحكم في إدارة قائمة انتظار الوصول
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
									placeholder="Enter your email"
									disabled={loading}
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
									placeholder="Enter your password"
									disabled={loading}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
									disabled={loading}>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						{error && (
							<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
								<AlertCircle className="w-5 h-5 text-red-500 mr-2" />
								<span className="text-red-700 text-sm">{error}</span>
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
							{loading ? (
								<>
									<LoadingSpinner size="sm" className="mr-2" />
									جاري تسجيل الدخول...
								</>
							) : (
								"تسجيل الدخول"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

"use client";

import React, { useState } from "react";
import {
	Plus,
	Minus,
	Settings,
	LogOut,
	Users,
	Clock,
	RotateCcw,
} from "lucide-react";
import { useQueue } from "../hooks/useQueue";
import { LoadingSpinner } from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useGetEstimatedTime } from "../hooks/useGetEstimatedTime";

export const DashboardClient: React.FC = () => {
	const { queue, loading, error, updateQueue } = useQueue();
	const [isUpdating, setIsUpdating] = useState(false);
	const router = useRouter();
	const supabase = createClientComponentClient();

	const time = useGetEstimatedTime(queue);

	const handleIncrement = async () => {
		if (isUpdating) return;
		setIsUpdating(true);
		await updateQueue((queue?.queue_number || 0) + 1);
		setIsUpdating(false);
	};

	const handleDecrement = async () => {
		if (isUpdating || (queue?.queue_number || 0) <= 0) return;
		setIsUpdating(true);
		await updateQueue((queue?.queue_number || 0) - 1);
		setIsUpdating(false);
	};

	const handleReset = async () => {
		if (isUpdating) return;
		setIsUpdating(true);
		await updateQueue(0);
		setIsUpdating(false);
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/");
	};

	if (loading && !queue) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center">
				<div className="text-center">
					<LoadingSpinner size="lg" className="mx-auto mb-4" />
					<p className="text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4 pt-16">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mr-4">
								<Settings className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-800">
									لوحة معلومات قائمة الانتظار
								</h1>
								<p className="text-gray-600">إدارة عمليات قائمة الانتظار</p>
							</div>
						</div>
						<button
							onClick={handleLogout}
							className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
							<LogOut className="w-5 h-5 mr-2" />
							تسجيل الخروج
						</button>
					</div>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
						<p className="text-red-700">{error}:خطأ</p>
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Current Queue Status */}
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
						<div className="flex items-center mb-4">
							<Users className="w-6 h-6 text-blue-500 mr-3" />
							<h2 className="text-xl font-semibold text-gray-800">
								قائمة الانتظار الحالية
							</h2>
						</div>

						<div className="text-center mb-6">
							<div className="text-5xl font-bold text-blue-600 mb-2">
								{queue?.queue_number || 0}
							</div>
							<div className="text-gray-600">
								{queue?.queue_number === 0 ? "المكان متاح" : `عدد المنتظرين`}
							</div>
						</div>

						<div className="bg-blue-50 rounded-xl p-4">
							<div className="flex items-center text-blue-700 mb-2">
								<Clock className="w-5 h-5 mr-2" />
								<span className="font-semibold">وقت الانتظار المقدر</span>
							</div>
							<div className="text-lg font-semibold text-blue-800">{time}</div>
							{queue && queue.queue_number > 0 && (
								<div className="text-sm text-blue-600 mt-2">
									الوقت يحدث بأستمرار مع اخر تحديث للقائمة
								</div>
							)}
						</div>
					</div>

					{/* Queue Controls */}
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
						<div className="flex items-center mb-4">
							<Settings className="w-6 h-6 text-green-500 mr-3" />
							<h2 className="text-xl font-semibold text-gray-800">
								عناصر التحكم في قائمة الانتظار
							</h2>
						</div>

						<div className="space-y-4">
							{/* Increment/Decrement */}
							<div className="flex gap-4">
								<button
									onClick={handleIncrement}
									disabled={isUpdating}
									className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
									{isUpdating ? (
										<LoadingSpinner size="sm" className="mr-2" />
									) : (
										<Plus className="w-5 h-5 mr-2" />
									)}
									إضافة شخص
								</button>

								<button
									onClick={handleDecrement}
									disabled={isUpdating || (queue?.queue_number || 0) <= 0}
									className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
									{isUpdating ? (
										<LoadingSpinner size="sm" className="mr-2" />
									) : (
										<Minus className="w-5 h-5 mr-2" />
									)}
									خفض شخص
								</button>
							</div>

							{/* Reset */}
							<button
								onClick={handleReset}
								disabled={isUpdating || (queue?.queue_number || 0) === 0}
								className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
								{isUpdating ? (
									<LoadingSpinner size="sm" className="mr-2" />
								) : (
									<RotateCcw className="w-5 h-5 mr-2" />
								)}
								إعادة تعيين قائمة الانتظار
							</button>
						</div>

						{/* Quick Actions Info */}
						<div className="mt-6 bg-gray-50 rounded-xl p-4">
							<h3 className="font-semibold text-gray-800 mb-2">
								كيفية حساب الوقت الانتظار المقدر
							</h3>
							<div className="text-sm text-gray-600 space-y-1">
								<div>الوقت الأساسي: 10 دقائق للشخص الواحد •</div>
								<div>الوقت يتناقص مع مرور الدقائق •</div>
								<div>يتم التحديث تلقائيًا كل ثانية •</div>
								<div>يظهر "الخدمة جاهزة" عند انتهاء الوقت •</div>
							</div>
						</div>
					</div>
				</div>

				{/* Queue Info */}
				<div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">
						معلومات قائمة الانتظار
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div className="grid">
							<span className="font-medium text-gray-700">آخر تحديث:</span>
							<span className="text-gray-600">
								{queue?.updated_at
									? new Date(queue.updated_at).toLocaleString()
									: "Never"}
							</span>
						</div>
						<div className="grid">
							<span className="font-medium text-gray-700">تم الانشاء:</span>
							<span className="text-gray-600">
								{queue?.created_at
									? new Date(queue.created_at).toLocaleString()
									: "Never"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

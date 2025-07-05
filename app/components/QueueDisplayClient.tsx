"use client";

import React, { useState, useEffect } from "react";
import { Clock, Users, RefreshCw } from "lucide-react";
import { useQueue } from "../hooks/useQueue";
import { LoadingSpinner } from "./LoadingSpinner";
import { QueueEntry } from "../types";
import { useGetEstimatedTime } from "../hooks/useGetEstimatedTime";

interface QueueDisplayClientProps {
	initialQueue?: QueueEntry;
	error?: string;
}

export const QueueDisplayClient: React.FC<QueueDisplayClientProps> = ({
	initialQueue,
	error: initialError,
}) => {
	const { queue, loading, error, refetch } = useQueue(true, initialQueue);

	const time = useGetEstimatedTime(queue);

	// Helper to get time elapsed in minutes since last update
	function getTimeElapsedMinutes(queue: QueueEntry | null | undefined) {
		if (!queue) return null;
		const lastUpdate = new Date(queue.updated_at);
		const timeElapsedMs = Date.now() - lastUpdate.getTime();
		return Math.floor(timeElapsedMs / (1000 * 60));
	}

	const getTimeElapsedSinceUpdate = () => {
		const timeElapsedMinutes = getTimeElapsedMinutes(queue);
		if (timeElapsedMinutes === null) return "";

		if (timeElapsedMinutes < 1) {
			return "تم التحديث للتو";
		} else if (timeElapsedMinutes === 1) {
			return "منذ دقيقة واحدة";
		} else if (timeElapsedMinutes < 60) {
			return `منذ ${timeElapsedMinutes} دقائق`;
		} else {
			const hours = Math.floor(timeElapsedMinutes / 60);
			const minutes = timeElapsedMinutes % 60;
			if (hours === 1) {
				return minutes > 0 ? `د${minutes}ساعة و` : "منذ ساعة واحدة";
			} else {
				return minutes > 0 ? `س${hours} د${minutes} منذ` : `ساعة ${hours} منذ`;
			}
		}
	};

	const getStatusColor = () => {
		const timeElapsedMinutes = getTimeElapsedMinutes(queue);
		if (timeElapsedMinutes === null) return "text-gray-600";
		if (timeElapsedMinutes < 2) return "text-green-600";
		if (timeElapsedMinutes < 10) return "text-yellow-600";
		return "text-red-600";
	};

	const getStatusDot = () => {
		const timeElapsedMinutes = getTimeElapsedMinutes(queue);
		if (timeElapsedMinutes === null) return "bg-gray-500";
		if (timeElapsedMinutes < 2) return "bg-green-500 animate-pulse";
		if (timeElapsedMinutes < 10) return "bg-yellow-500";
		return "bg-red-500";
	};

	if (loading && !queue) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<LoadingSpinner size="lg" className="mx-auto mb-4" />
					<p className="text-gray-600">جاري تحميل معلومات قائمة الانتظار...</p>
				</div>
			</div>
		);
	}

	if (error || initialError) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-xl mb-2">⚠️</div>
					<p className="text-red-600">
						Error loading queue: {error || initialError}
					</p>
					<button
						onClick={refetch}
						className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
						حاول ثانية
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Main Queue Card */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center mb-6 border border-white/20">
					<div className="mb-6">
						<Users className="w-12 h-12 text-blue-500 mx-auto mb-3" />
						<h1 className="text-2xl font-bold text-gray-800 mb-2">
							قائمة الانتظار الحالية
						</h1>
						<p className="text-gray-600">حالة قائمة الانتظار المباشرة</p>
					</div>

					<div className="mb-6">
						<div className="text-6xl font-bold text-blue-600 mb-2">
							{queue?.queue_number || 0}
						</div>
						<div className="text-lg text-gray-600">
							{queue?.queue_number === 0 ? "المكان متاح" : `الأشخاص المنتظرين`}
						</div>
					</div>

					<div className="bg-blue-50 rounded-2xl p-4 mb-4">
						<div className="flex items-center justify-center text-blue-700 mb-2">
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

					<div className="flex items-center justify-center text-sm text-gray-500">
						<RefreshCw className="w-4 h-4 mr-1" />
						<span>التحديثات التلقائية كل 30 ثانية</span>
					</div>
				</div>

				{/* Status Card */}
				<div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-4 text-center border border-white/20">
					<div className="text-sm text-gray-600 mb-2">
						آخر تحديث لقائمة الانتظار
					</div>
					<div className="text-sm font-medium text-gray-800 mb-2">
						{getTimeElapsedSinceUpdate()}
					</div>
					<div className="text-xs text-gray-500 mb-3">
						{queue?.updated_at
							? new Date(queue.updated_at).toLocaleString()
							: "Never"}
					</div>
					<div className="flex items-center justify-center">
						<div
							className={`w-2 h-2 rounded-full mr-2 ${getStatusDot()}`}></div>
						<span className={`text-sm font-medium ${getStatusColor()}`}>
							{(() => {
								if (!queue) return "Offline";
								const lastUpdate = new Date(queue.updated_at);
								const timeElapsedMs = +time - lastUpdate.getTime();
								const timeElapsedMinutes = Math.floor(
									timeElapsedMs / (1000 * 60)
								);

								if (timeElapsedMinutes < 2) return "مباشر";
								if (timeElapsedMinutes < 10) return "تم التحديث منذ قليل";
								return "لم يحدث منذ فتره";
							})()}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

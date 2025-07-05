import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
	title: "Queue Management System",
	description: "Live queue management system with real-time updates",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" dir="rtl">
			<body>
				<Header />
				{children}
			</body>
		</html>
	);
}

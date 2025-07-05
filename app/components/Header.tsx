import Link from "next/link";

export default function Header() {
	return (
		<header className="absolute top-0 z-20 w-full">
			<Link
				href={"/"}
				className="text-3xl font-bold text-blue-600 w-full flex items-center justify-center md:px-6 drop-shadow-blue-600">
				ريماس
			</Link>
		</header>
	);
}

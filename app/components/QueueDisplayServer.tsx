import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { QueueDisplayClient } from "./QueueDisplayClient";

export async function QueueDisplayServer() {
	const supabase = createServerComponentClient({ cookies });

	try {
		const { data: queue, error } = await supabase
			.from("queue")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(1)
			.single();

		if (error && error.code !== "PGRST116") {
			throw error;
		}

		const initialQueue = queue || {
			id: "current",
			queue_number: 0,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		return <QueueDisplayClient initialQueue={initialQueue} />;
	} catch (error) {
		return (
			<QueueDisplayClient
				error={error instanceof Error ? error.message : "Failed to load queue"}
			/>
		);
	}
}

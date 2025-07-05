import { useEffect, useState } from "react";
import { QueueEntry } from "../types";

export function useGetEstimatedTime(queue: QueueEntry | null) {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getDynamicEstimatedTime = () => {

        if (!queue || queue.queue_number === 0) return "المكان متاح";

        const avgTimePerPerson = 10;
        const totalBaseMinutes = queue.queue_number * avgTimePerPerson;

        const lastUpdate = new Date(queue.updated_at);
        const timeElapsedMs = currentTime.getTime() - lastUpdate.getTime();
        const timeElapsedMinutes = Math.floor(timeElapsedMs / (1000 * 60));

        const adjustedMinutes = Math.max(0, totalBaseMinutes - timeElapsedMinutes);

        if (adjustedMinutes === 0) {
            return "جاهز للخدمة";
        } else if (adjustedMinutes < 60) {
            return `~${adjustedMinutes} ${adjustedMinutes > 1 ? "دقائق" : "دقيقه"}`;
        } else {
            const hours = Math.floor(adjustedMinutes / 60);
            const minutes = adjustedMinutes % 60;
            return `~${hours}س ${minutes}د`;
        }
    };

    return getDynamicEstimatedTime();
}
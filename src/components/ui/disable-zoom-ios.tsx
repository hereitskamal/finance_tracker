import { useEffect } from "react";

export default function DisableZoomiOS() {
    useEffect(() => {
        const preventZoom = (e: Event) => {
            e.preventDefault();
        };

        document.addEventListener("gesturestart", preventZoom);
        document.addEventListener("touchmove", (e: TouchEvent) => {
            if (e.touches.length > 1) e.preventDefault();
        }, { passive: false });

        return () => {
            document.removeEventListener("gesturestart", preventZoom);
        };
    }, []);

    return null;
}
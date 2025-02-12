"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const useUpdateLastNav = () => {
    const pathname = usePathname();

    useEffect(() => {
        const updateLastNav = async () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                await fetch("/api/update-last-nav", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId, lastNav: pathname }),
                });
            }
        };

        updateLastNav();
    }, [pathname]); // Runs every time pathname changes
};

export default useUpdateLastNav;
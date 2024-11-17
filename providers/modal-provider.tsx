"use client";

// global imports
import { useEffect, useState } from "react";

// local imports
import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider  = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    )
}

/* We will have to add this provider to the layout so that its univeersally accisible, but we can't add a client component to a server component directly (to prevent hydration error)

-> This ensures untill the lifecycle has run (which can only happen in the client component) I return null, 
So No Hydration Error
*/
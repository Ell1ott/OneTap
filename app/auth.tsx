import Drawer from "components/base/Drawer";
import Auth from "utils/supabase/Auth";
import { router } from "expo-router";
import { useState } from "react";

export default function AuthScreen() {
    const [shouldClose, setShouldClose] = useState(false);
    return (
        <Drawer isOpen={true} startClose={shouldClose} onClose={() => { router.push('/') }} isDismissable={false} className="bg-card">
            <Auth closeAuthPage={() => { setShouldClose(true) }} />
        </Drawer>
    )
}   
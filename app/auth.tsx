import Drawer from 'components/base/Drawer';
import Auth from 'components/Auth';
import { router } from 'expo-router';
import { useState } from 'react';
import { supabase } from 'utils/supabase/SupaLegend';

export default function AuthScreen() {
    const [shouldClose, setShouldClose] = useState(false);

    const [isDismissable, setIsDismissable] = useState(false);
    supabase.auth.onAuthStateChange((event, session) => {
        setIsDismissable(session !== null);
    });
    return (
        <Drawer
            isOpen={true}
            startClose={shouldClose}
            onClose={() => {
                router.push('/');
            }}
            isDismissable={isDismissable}
            className="bg-card">
            <Auth
                closeAuthPage={() => {
                    setShouldClose(true);
                }}
            />
        </Drawer>
    );
}

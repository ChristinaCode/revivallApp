
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AppTabs from '@/components/app-tabs';

const AppTabsWithAdmin = AppTabs as unknown as React.ComponentType<{ isAdmin: boolean }>;

export default function TabsLayout() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('admin')
        .eq('id', user.id)
        .single();

      console.log('Admin check:', { data, error });
      setIsAdmin(!error && data?.admin === true);
    }

    void checkAdmin();
  }, []);

  return <AppTabsWithAdmin isAdmin={isAdmin} />;
}

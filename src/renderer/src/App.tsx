import { useEffect, useState } from 'react';
import { SetupWizard } from './screens/SetupWizard/SetupWizard';
import { Chat } from './screens/Chat/Chat';
import { SettingsPanel } from './screens/Settings/SettingsPanel';
import { useSettingsStore } from './state/settingsStore';
import { useAppliedTheme } from './hooks/useAppliedTheme';

export function App() {
  const settings = useSettingsStore((s) => s.settings);
  const loading = useSettingsStore((s) => s.loading);
  const load = useSettingsStore((s) => s.load);
  const update = useSettingsStore((s) => s.update);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    void load();
  }, [load]);

  useAppliedTheme(settings?.theme);

  if (loading || !settings) {
    return <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-[#0B0B12]" />;
  }

  if (!settings.onboarded) {
    return <SetupWizard onComplete={() => void update({ onboarded: true })} />;
  }

  return (
    <>
      <Chat onOpenSettings={() => setSettingsOpen(true)} />
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </>
  );
}

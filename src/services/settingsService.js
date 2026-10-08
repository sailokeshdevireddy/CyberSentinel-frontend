const DEFAULT_SETTINGS = {
  theme: 'system',
  denseLayout: false,
  notifications: {
    CRITICAL_THREAT: true,
    INCIDENT_CREATED: true,
    INCIDENT_ASSIGNED: true,
    SYSTEM: false
  }
};

export const getSettings = async () => {
  const stored = localStorage.getItem('cs_settings');
  if (stored) {
    try {
      return { success: true, data: { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } };
    } catch(e) {
      console.error('Failed to parse settings');
    }
  }
  return { success: true, data: DEFAULT_SETTINGS };
};

export const saveSettings = async (newSettings) => {
  localStorage.setItem('cs_settings', JSON.stringify(newSettings));
  return { success: true, data: newSettings };
};

export const getMonthKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const formatMonthLabel = (date = new Date(), locale = 'fr-FR') => {
  const label = date.toLocaleString(locale, { month: 'long', year: 'numeric' });
  return label.toUpperCase();
};

export const formatDuration = (totalSeconds: number) => {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
};


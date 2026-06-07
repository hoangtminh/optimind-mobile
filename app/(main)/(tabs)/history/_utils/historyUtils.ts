// Helper function to format date exactly like Oct 12, 14:30
export const formatSessionDateTime = (
  dateStr?: string,
  startTime?: string,
  endTime?: string,
): string => {
  const actualDateStr = dateStr || startTime || endTime;
  if (!actualDateStr) return "";
  try {
    const d = new Date(actualDateStr);
    if (isNaN(d.getTime())) return actualDateStr;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const day = d.getDate().toString().padStart(2, "0");
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${month} ${day}, ${hours}:${minutes}`;
  } catch (e) {
    return actualDateStr;
  }
};

// Helper function to format date exactly like Oct 12, 2026
export const formatSessionDateOnly = (
  dateStr?: string,
  startTime?: string,
  endTime?: string,
): string => {
  const actualDateStr = dateStr || startTime || endTime;
  if (!actualDateStr) return "";
  try {
    const d = new Date(actualDateStr);
    if (isNaN(d.getTime())) return actualDateStr;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch (e) {
    return actualDateStr;
  }
};

// Format duration in seconds to DD days hh:mm:ss format, only showing non-zero units (e.g. 5m02s)
export const formatSecondsDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return "0s";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.round(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) {
    const minStr =
      days > 0 || hours > 0
        ? `${minutes.toString().padStart(2, "0")}m`
        : `${minutes}m`;
    parts.push(minStr);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    const secStr =
      days > 0 || hours > 0 || minutes > 0
        ? `${remainingSeconds.toString().padStart(2, "0")}s`
        : `${remainingSeconds}s`;
    parts.push(secStr);
  }
  return parts.join("");
};

// Generate labels for the X axis of the focus chart
export const getChartLabels = (
  durationInMinutes: number,
  dataPointsCount: number,
): string[] => {
  const interval = durationInMinutes / Math.max(1, dataPointsCount - 1);
  return Array.from({ length: dataPointsCount }, (_, i) => {
    if (i === 0) return "0m";
    if (i === dataPointsCount - 1) return `${durationInMinutes}m`;
    if (dataPointsCount > 4 && i === Math.floor(dataPointsCount / 2)) {
      return `${Math.round(i * interval)}m`;
    }
    return "";
  });
};

// Format chart labels to display offsets in seconds, avoiding overlap on mobile
export const getSecondsChartLabels = (offsets: number[]): string[] => {
  const count = offsets.length;
  return offsets.map((offset, i) => {
    if (i === 0) return "0s";
    if (i === count - 1) return `${offset}s`;
    if (count > 4 && i === Math.floor(count / 2)) {
      return `${offset}s`;
    }
    return "";
  });
};

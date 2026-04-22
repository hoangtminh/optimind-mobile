import { useMemo } from "react";

// Utility hook for formatting time
export function useTimeFormatter() {
	const formatDuration = (minutes: number): string => {
		if (minutes < 60) {
			return `${minutes}m`;
		}
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0
			? `${hours}h ${remainingMinutes}m`
			: `${hours}h`;
	};

	const formatTime = (date: Date | string): string => {
		const d = typeof date === "string" ? new Date(date) : date;
		return d.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDate = (date: Date | string): string => {
		const d = typeof date === "string" ? new Date(date) : date;
		return d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatRelativeTime = (date: Date | string): string => {
		const d = typeof date === "string" ? new Date(date) : date;
		const now = new Date();
		const diffInMs = now.getTime() - d.getTime();
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
		const diffInHours = Math.floor(diffInMinutes / 60);
		const diffInDays = Math.floor(diffInHours / 24);

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInHours < 24) return `${diffInHours}h ago`;
		if (diffInDays < 7) return `${diffInDays}d ago`;

		return formatDate(d);
	};

	return {
		formatDuration,
		formatTime,
		formatDate,
		formatRelativeTime,
	};
}

// Utility hook for calculating progress
export function useProgressCalculator() {
	const calculatePercentage = (completed: number, total: number): number => {
		if (total === 0) return 0;
		return Math.round((completed / total) * 100);
	};

	const getProgressColor = (percentage: number): string => {
		if (percentage >= 80) return "#10b981"; // green
		if (percentage >= 60) return "#3b82f6"; // blue
		if (percentage >= 40) return "#f59e0b"; // yellow
		return "#ef4444"; // red
	};

	const getLevelFromExperience = (experience: number): number => {
		// Simple leveling system: level = floor(sqrt(experience / 100)) + 1
		return Math.floor(Math.sqrt(experience / 100)) + 1;
	};

	const getExperienceForNextLevel = (currentLevel: number): number => {
		// Experience needed = level^2 * 100
		return currentLevel * currentLevel * 100;
	};

	const getExperienceProgress = (
		experience: number,
	): { current: number; needed: number; percentage: number } => {
		const currentLevel = getLevelFromExperience(experience);
		const currentLevelExp = (currentLevel - 1) * (currentLevel - 1) * 100;
		const nextLevelExp = currentLevel * currentLevel * 100;

		const currentLevelProgress = experience - currentLevelExp;
		const neededForNext = nextLevelExp - currentLevelExp;

		return {
			current: currentLevelProgress,
			needed: neededForNext,
			percentage: calculatePercentage(
				currentLevelProgress,
				neededForNext,
			),
		};
	};

	return {
		calculatePercentage,
		getProgressColor,
		getLevelFromExperience,
		getExperienceForNextLevel,
		getExperienceProgress,
	};
}

// Utility hook for generating colors
export function useColorGenerator() {
	const projectColors = useMemo(
		() => [
			"#0058be", // blue
			"#10b981", // green
			"#f59e0b", // yellow
			"#ef4444", // red
			"#8b5cf6", // purple
			"#06b6d4", // cyan
			"#f97316", // orange
			"#84cc16", // lime
		],
		[],
	);

	const getProjectColor = (index: number): string => {
		return projectColors[index % projectColors.length];
	};

	const priorityColors = useMemo(
		() => ({
			low: "#10b981",
			medium: "#f59e0b",
			high: "#ef4444",
		}),
		[],
	);

	const getPriorityColor = (priority: "low" | "medium" | "high"): string => {
		return priorityColors[priority];
	};

	return {
		getProjectColor,
		getPriorityColor,
		projectColors,
		priorityColors,
	};
}

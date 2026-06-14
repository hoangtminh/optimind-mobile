export interface UserProfile {
	id: string;
	email: string;
	username?: string;
	role?: string;
	imageUrl?: string;
	coins?: number;
	currentStreak?: number;
	exp?: number;
	lastActiveDate?: string;
	level?: number;
	longestStreak?: number;
	studyTime?: number;
	createdAt?: string;
}

export interface LeaderboardUser {
	id: string;
	name: string;
	avatar?: string;
	level: number;
	totalStudyTime: number;
	completedTasks: number;
	streak: number;
	rank: number;
	isCurrentUser?: boolean;
}

export interface LeaderboardResponse {
	topUsers: LeaderboardUser[];
	currentUser: LeaderboardUser;
	currentUserRank: number;
}


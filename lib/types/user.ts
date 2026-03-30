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

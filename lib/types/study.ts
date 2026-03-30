export interface StudySession {
	id: string;
	date: string;
	duration: number;
	type: string;
	completed: boolean;
	userId?: string;
}

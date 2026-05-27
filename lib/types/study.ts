export interface StudySession {
	id: string;
	date: string;
	duration: number;
	type: string;
	completed: boolean;
	userId?: string;
	averageFocus?: number;
	focusData?: { timestamp: string; focusLevel?: number; focusPoint?: number }[];
	startTime?: string;
	endTime?: string;
	totalTime?: number;
	focusTime?: number;
	breakTime?: number;
	cycles?: number;
	sessionType?: string;
}


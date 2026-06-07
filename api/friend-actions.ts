import { apiGet, apiPost, apiDelete, ApiResponse } from "./client";

export interface UserSummary {
	id: string;
	username: string;
	email: string;
	imageUrl: string | null;
}

export interface FriendRequestResponse {
	id: string;
	user: UserSummary;
}

export interface FriendResponse {
	friendshipId: string;
	friend: UserSummary;
}

export interface SearchFriendResult {
	id: string;
	username: string;
	email: string;
	imageUrl: string | null;
	relationStatus: "FRIEND" | "REQUEST_SENT" | "REQUEST_RECEIVED" | "NONE" | "SELF";
}

export const friendActions = {
	getFriends: (): Promise<ApiResponse<FriendResponse[]>> =>
		apiGet<FriendResponse[]>(`/api/friends`),
	getIncomingRequests: (): Promise<ApiResponse<FriendRequestResponse[]>> =>
		apiGet<FriendRequestResponse[]>(`/api/friends/requests/incoming`),
	getSentRequests: (): Promise<ApiResponse<FriendRequestResponse[]>> =>
		apiGet<FriendRequestResponse[]>(`/api/friends/requests/sent`),
	sendFriendRequest: (email: string): Promise<ApiResponse<FriendRequestResponse>> =>
		apiPost<FriendRequestResponse>(`/api/friends/requests`, { email }),
	acceptFriendRequest: (requestId: string): Promise<ApiResponse<FriendResponse>> =>
		apiPost<FriendResponse>(`/api/friends/requests/${requestId}/accept`),
	declineFriendRequest: (requestId: string): Promise<ApiResponse<void>> =>
		apiDelete<void>(`/api/friends/requests/${requestId}/decline`),
	withdrawFriendRequest: (requestId: string): Promise<ApiResponse<void>> =>
		apiDelete<void>(`/api/friends/requests/${requestId}/withdraw`),
	unfriend: (friendId: string): Promise<ApiResponse<void>> =>
		apiDelete<void>(`/api/friends/${friendId}`),
	searchFriendByEmail: (email: string): Promise<ApiResponse<SearchFriendResult>> =>
		apiGet<SearchFriendResult>(`/api/friends/search?email=${encodeURIComponent(email)}`),
};
export default friendActions;

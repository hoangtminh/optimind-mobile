import React from "react";
import { StyleSheet, View } from "react-native";
import { Theme } from "@/constants/Theme";
import { SkeletonItem } from "./SkeletonItem";

export function LeaderboardSkeletons() {
	return (
		<View style={styles.container}>
			{/* Podium Skeleton */}
			<View style={styles.podiumContainer}>
				{/* 2nd place skeleton */}
				<View style={styles.podItem}>
					<SkeletonItem style={styles.avatar2} />
					<SkeletonItem style={styles.name} />
					<SkeletonItem style={styles.block2} />
				</View>
				{/* 1st place skeleton */}
				<View style={[styles.podItem, styles.podItem1]}>
					<SkeletonItem style={styles.avatar1} />
					<SkeletonItem style={styles.name} />
					<SkeletonItem style={styles.block1} />
				</View>
				{/* 3rd place skeleton */}
				<View style={styles.podItem}>
					<SkeletonItem style={styles.avatar3} />
					<SkeletonItem style={styles.name} />
					<SkeletonItem style={styles.block3} />
				</View>
			</View>

			{/* List rows skeletons */}
			{[1, 2, 3, 4, 5].map((key) => (
				<View key={key} style={styles.rowContainer}>
					<SkeletonItem style={styles.rowBadge} />
					<View style={styles.rowInfo}>
						<SkeletonItem style={styles.rowTitle} />
						<SkeletonItem style={styles.rowSub} />
					</View>
					<View style={styles.rowStats}>
						<SkeletonItem style={styles.rowVal} />
						<SkeletonItem style={styles.rowSubVal} />
					</View>
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
	},
	podiumContainer: {
		flexDirection: "row",
		alignItems: "flex-end",
		height: 200,
		marginBottom: 28,
		paddingHorizontal: 10,
	},
	podItem: {
		flex: 1,
		alignItems: "center",
	},
	podItem1: {
		flex: 1.2,
	},
	avatar1: {
		width: 60,
		height: 60,
		borderRadius: 30,
		marginBottom: 12,
	},
	avatar2: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginBottom: 12,
	},
	avatar3: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginBottom: 12,
	},
	name: {
		width: 60,
		height: 12,
		marginBottom: 12,
	},
	block1: {
		width: "90%",
		height: 100,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	block2: {
		width: "90%",
		height: 75,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	block3: {
		width: "90%",
		height: 55,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	rowContainer: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: Theme.border,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Theme.surface,
	},
	rowBadge: {
		width: 36,
		height: 36,
		borderRadius: 18,
		marginRight: 14,
	},
	rowInfo: {
		flex: 1,
	},
	rowTitle: {
		width: 100,
		height: 14,
		marginBottom: 6,
	},
	rowSub: {
		width: 140,
		height: 10,
	},
	rowStats: {
		alignItems: "flex-end",
	},
	rowVal: {
		width: 55,
		height: 14,
		marginBottom: 6,
	},
	rowSubVal: {
		width: 40,
		height: 10,
	},
});

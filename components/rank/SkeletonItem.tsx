import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Theme } from "@/constants/Theme";

interface SkeletonItemProps {
	style?: any;
}

export function SkeletonItem({ style }: SkeletonItemProps) {
	const opacity = useRef(new Animated.Value(0.3)).current;

	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 0.7,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0.3,
					duration: 800,
					useNativeDriver: true,
				}),
			])
		);
		animation.start();
		return () => animation.stop();
	}, [opacity]);

	return (
		<Animated.View
			style={[
				{
					backgroundColor: Theme.border,
					borderRadius: 12,
				},
				style,
				{ opacity },
			]}
		/>
	);
}

import React, { useMemo } from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface TimerCircleProps {
	timeLeft: number;
	totalTime: number;
	mode: "focus" | "break";
}

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs
		.toString()
		.padStart(2, "0")}`;
};

export default function TimerCircle({
	timeLeft,
	totalTime,
	mode,
}: TimerCircleProps) {
	const size = 280;
	const strokeWidth = 8;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;

	const progress = useMemo(() => {
		return totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
	}, [timeLeft, totalTime]);

	const strokeColor = mode === "focus" ? "#0058be" : "#10b981";

	return (
		<View className="items-center justify-center mb-8">
			<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="#edeef0"
					strokeWidth={strokeWidth}
					fill="none"
				/>
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={strokeColor}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={circumference * (1 - progress)}
					strokeLinecap="round"
					fill="none"
					transform={`rotate(-90, ${size / 2}, ${size / 2})`}
				/>
			</Svg>
			<View className="absolute items-center">
				<Text className="text-6xl font-extrabold text-slate-900">
					{formatTime(timeLeft)}
				</Text>
				<Text className="text-sm text-gray-500 mt-2 uppercase font-semibold">
					{mode === "focus" ? "Focus Session" : "Break Time"}
				</Text>
			</View>
		</View>
	);
}

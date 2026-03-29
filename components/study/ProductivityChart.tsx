import React, { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";

interface ProductivityChartProps {
	isRunning: boolean;
	timeElapsed: number;
}

const { width } = Dimensions.get("window");

export default function ProductivityChart({
	isRunning,
	timeElapsed,
}: ProductivityChartProps) {
	const [dataPoints, setDataPoints] = useState<number[]>([]);

	useEffect(() => {
		if (isRunning) {
			// Generate random productivity data point every second
			setDataPoints((prev) => {
				const newPoints = [...prev];
				const randomValue = Math.random() * 100;
				newPoints.push(randomValue);
				// Keep last 10 data points for the chart
				if (newPoints.length > 10) {
					newPoints.shift();
				}
				return newPoints;
			});
		}
	}, [timeElapsed, isRunning]);

	// Generate SVG path for the chart
	const generatePath = () => {
		if (dataPoints.length < 2) return "";

		const chartWidth = width - 80;
		const chartHeight = 100;
		const pointSpacing = chartWidth / (dataPoints.length - 1 || 1);

		let path = `M0,${chartHeight}`;

		dataPoints.forEach((value, index) => {
			const x = index * pointSpacing;
			const y = chartHeight - (value / 100) * chartHeight;
			path += ` L${x},${y}`;
		});

		return path;
	};

	return (
		<View className="bg-[#f3f4f6] rounded-[32px] p-6">
			<View className="flex-row justify-between items-center mb-6">
				<View>
					<Text className="font-bold text-slate-900">
						Productivity Flow
					</Text>
					<Text className="text-[10px] text-gray-500 mt-1">
						Focus concentration levels
					</Text>
				</View>
				<View className="flex-row items-center bg-white px-2 py-1 rounded-full border border-blue-100">
					<View className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
					<Text className="text-[9px] font-bold text-blue-600 uppercase">
						Real-time
					</Text>
				</View>
			</View>

			<Svg
				height="100"
				width={width - 80}
				viewBox={`0 0 ${width - 80} 100`}
			>
				<Line
					x1="0"
					y1="20"
					x2={width - 80}
					y2="20"
					stroke="#e1e2e4"
					strokeDasharray="4"
				/>
				<Line
					x1="0"
					y1="50"
					x2={width - 80}
					y2="50"
					stroke="#e1e2e4"
					strokeDasharray="4"
				/>
				{dataPoints.length > 0 && (
					<Path
						d={generatePath()}
						fill="none"
						stroke="#0058be"
						strokeWidth="3"
					/>
				)}
			</Svg>
			<View className="flex-row justify-between mt-4 px-2">
				<Text className="text-[9px] text-gray-400 font-bold">
					{dataPoints.length === 0 ? "Start" : "0s"}
				</Text>
				<Text className="text-[9px] text-gray-400 font-bold">
					{dataPoints.length > 0
						? `${dataPoints.length}s`
						: "progress"}
				</Text>
				<Text className="text-[9px] text-gray-400 font-bold">
					{dataPoints.length === 0
						? "Timer"
						: `+${dataPoints.length * 2}s`}
				</Text>
			</View>
		</View>
	);
}

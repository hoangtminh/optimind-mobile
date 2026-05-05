import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from "react-native-svg";
import { Text, View, XStack, YStack } from "tamagui";

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
			setDataPoints((prev) => {
				const newPoints = [...prev];
				// Simulated focus value between 40-95
				const randomValue = 40 + Math.random() * 55;
				newPoints.push(randomValue);
				if (newPoints.length > 12) {
					newPoints.shift();
				}
				return newPoints;
			});
		}
	}, [timeElapsed, isRunning]);

	const generatePath = () => {
		if (dataPoints.length < 2) return "";
		const chartWidth = width - 80;
		const chartHeight = 100;
		const pointSpacing = chartWidth / (dataPoints.length - 1 || 1);
		let path = `M 0 ${chartHeight - (dataPoints[0] / 100) * chartHeight}`;
		dataPoints.forEach((value, index) => {
			const x = index * pointSpacing;
			const y = chartHeight - (value / 100) * chartHeight;
			path += ` L ${x} ${y}`;
		});
		return path;
	};

	const generateAreaPath = () => {
		const linePath = generatePath();
		if (!linePath) return "";
		const chartWidth = width - 80;
		const chartHeight = 100;
		return `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
	};

	return (
		<YStack
			backgroundColor="#FBF8FD"
			borderRadius={32}
			padding="$5"
			shadowColor="#000"
			shadowRadius={20}
			shadowOpacity={0.03}
			gap="$4"
		>
			<XStack justifyContent="space-between" alignItems="center">
				<YStack gap="$1">
					<Text style={{ fontSize: 16, fontWeight: "900", color: "#1D1B20" }}>
						Productivity Flow
					</Text>
					<XStack alignItems="center" gap="$2">
						<View width={8} height={8} borderRadius={4} backgroundColor="#6750A4" />
						<Text style={{ fontSize: 11, fontWeight: "700", color: "#7A7582", textTransform: "uppercase", letterSpacing: 0.5 }}>
							Live Concentration
						</Text>
					</XStack>
				</YStack>
				<View backgroundColor="#EADDFF" paddingHorizontal="$3" paddingVertical="$1" borderRadius={100}>
					<Text style={{ fontSize: 10, fontWeight: "900", color: "#21005D" }}>
						STABLE
					</Text>
				</View>
			</XStack>

			<View height={100} width={width - 80} overflow="hidden">
				<Svg height="100" width={width - 80}>
					<Defs>
						<SvgGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor="#6750A4" stopOpacity="0.2" />
							<Stop offset="1" stopColor="#6750A4" stopOpacity="0" />
						</SvgGradient>
					</Defs>
					
					{/* Grid Lines */}
					{[20, 50, 80].map((y) => (
						<Path
							key={y}
							d={`M 0 ${y} L ${width - 80} ${y}`}
							stroke="#E6E0E9"
							strokeWidth="1"
							strokeDasharray="4 4"
						/>
					))}

					{dataPoints.length > 0 && (
						<>
							<Path
								d={generateAreaPath()}
								fill="url(#areaGradient)"
							/>
							<Path
								d={generatePath()}
								fill="none"
								stroke="#6750A4"
								strokeWidth="3"
								strokeLinejoin="round"
								strokeLinecap="round"
							/>
						</>
					)}
				</Svg>
			</View>

			<XStack justifyContent="space-between" paddingHorizontal="$2">
				<YStack alignItems="center">
					<Text style={{ fontSize: 9, fontWeight: "900", color: "#7A7582" }}>AVG FOCUS</Text>
					<Text style={{ fontSize: 14, fontWeight: "900", color: "#1D1B20" }}>
						{dataPoints.length > 0 
							? Math.round(dataPoints.reduce((a, b) => a + b) / dataPoints.length) 
							: 0}%
					</Text>
				</YStack>
				<YStack alignItems="center">
					<Text style={{ fontSize: 9, fontWeight: "900", color: "#7A7582" }}>SESSION</Text>
					<Text style={{ fontSize: 14, fontWeight: "900", color: "#1D1B20" }}>
						{Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s
					</Text>
				</YStack>
				<YStack alignItems="center">
					<Text style={{ fontSize: 9, fontWeight: "900", color: "#7A7582" }}>RECOVERY</Text>
					<Text style={{ fontSize: 14, fontWeight: "900", color: "#1D1B20" }}>HIGH</Text>
				</YStack>
			</XStack>
		</YStack>
	);
}


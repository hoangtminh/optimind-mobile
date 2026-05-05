import { LinearGradient } from "expo-linear-gradient";
import {
	Brain,
	Coffee,
	Pause,
	Play,
	RotateCcw,
	Settings2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import { Button, Progress, Text, View, XStack, YStack } from "tamagui";

interface PomodoroProps {
	focusDuration: number;
	breakDuration: number;
	onFinish?: () => void;
	onStateChange?: (isRunning: boolean, timeElapsed: number) => void;
	onSettingsPress?: () => void;
}

export const PremiumPomodoro = ({
	focusDuration = 25,
	breakDuration = 5,
	onFinish,
	onStateChange,
	onSettingsPress,
}: PomodoroProps) => {
	const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
	const [isRunning, setIsRunning] = useState(false);
	const [mode, setMode] = useState<"focus" | "break">("focus");
	const [totalTime, setTotalTime] = useState(focusDuration * 60);

	useEffect(() => {
		setTotalTime(
			mode === "focus" ? focusDuration * 60 : breakDuration * 60,
		);
		setTimeLeft(mode === "focus" ? focusDuration * 60 : breakDuration * 60);
	}, [focusDuration, breakDuration, mode]);

	useEffect(() => {
		let interval: NodeJS.Timeout;

		if (isRunning && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((prev) => {
					const newTime = prev - 1;
					onStateChange?.(true, totalTime - newTime);
					return newTime;
				});
			}, 1000);
		} else if (timeLeft === 0) {
			setIsRunning(false);
			onFinish?.();
			// Auto switch mode
			setMode(mode === "focus" ? "break" : "focus");
		}

		return () => clearInterval(interval);
	}, [isRunning, timeLeft, mode, totalTime, onFinish, onStateChange]);

	const toggleTimer = () => setIsRunning(!isRunning);

	const resetTimer = () => {
		setIsRunning(false);
		setTimeLeft(totalTime);
		onStateChange?.(false, 0);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const progress = ((totalTime - timeLeft) / totalTime) * 100;

	// SVG Circle constants
	const size = 240;
	const strokeWidth = 10;
	const center = size / 2;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	return (
		<YStack
			padding="$6"
			borderRadius={40}
			backgroundColor="white"
			shadowColor="#6750A4"
			shadowRadius={40}
			shadowOpacity={0.15}
			gap="$6"
			alignItems="center"
		>
			<XStack
				gap="$2"
				backgroundColor="#F7F2FA"
				padding="$1.5"
				borderRadius={100}
				alignSelf="center"
			>
				<Button
					size="$3"
					borderRadius={100}
					backgroundColor={
						mode === "focus" ? "#6750A4" : "transparent"
					}
					onPress={() => setMode("focus")}
					chromeless={mode !== "focus"}
					pressStyle={{ scale: 0.95 }}
				>
					<XStack gap="$2" alignItems="center">
						<Brain
							size={16}
							color={mode === "focus" ? "white" : "#6750A4"}
						/>
						<Text
							fontWeight="700"
							color={mode === "focus" ? "white" : "#6750A4"}
							fontSize="$2"
						>
							Focus
						</Text>
					</XStack>
				</Button>
				<Button
					size="$3"
					borderRadius={100}
					backgroundColor={
						mode === "break" ? "#6750A4" : "transparent"
					}
					onPress={() => setMode("break")}
					chromeless={mode !== "break"}
					pressStyle={{ scale: 0.95 }}
				>
					<XStack gap="$2" alignItems="center">
						<Coffee
							size={16}
							color={mode === "break" ? "white" : "#6750A4"}
						/>
						<Text
							fontWeight="700"
							color={mode === "break" ? "white" : "#6750A4"}
							fontSize="$2"
						>
							Break
						</Text>
					</XStack>
				</Button>
			</XStack>

			<View
				position="relative"
				width={size}
				height={size}
				alignItems="center"
				justifyContent="center"
			>
				<Svg
					width={size}
					height={size}
					style={{
						position: "absolute",
						transform: [{ rotate: "-90deg" }],
					}}
				>
					{/* Background Circle */}
					<SvgCircle
						cx={center}
						cy={center}
						r={radius}
						stroke="#F3EDF7"
						strokeWidth={strokeWidth}
						fill="none"
					/>
					{/* Progress Circle */}
					<SvgCircle
						cx={center}
						cy={center}
						r={radius}
						stroke="#6750A4"
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap="round"
						fill="none"
					/>
				</Svg>

				<YStack alignItems="center" gap="$0">
					<Text
						fontSize={64}
						fontWeight="900"
						color="#1D1B20"
						lineHeight={72}
						letterSpacing={-2}
					>
						{formatTime(timeLeft)}
					</Text>
					<Text
						fontSize="$3"
						fontWeight="700"
						color="#7A7582"
						textTransform="uppercase"
						letterSpacing={2}
					>
						{mode === "focus" ? "Deep Work" : "Rest Up"}
					</Text>
				</YStack>
			</View>

			<XStack gap="$5" alignItems="center">
				<Button
					circular
					size="$5"
					backgroundColor="#F3EDF7"
					onPress={resetTimer}
					pressStyle={{ scale: 0.9, backgroundColor: "#EADDFF" }}
					icon={<RotateCcw size={24} color="#6750A4" />}
				/>

				<Button
					unstyled
					onPress={toggleTimer}
					pressStyle={{ scale: 0.92 }}
				>
					<LinearGradient
						colors={["#6750A4", "#4F378A"]}
						style={{
							width: 88,
							height: 88,
							borderRadius: 44,
							justifyContent: "center",
							alignItems: "center",
							shadowColor: "#6750A4",
							shadowOffset: { width: 0, height: 10 },
							shadowOpacity: 0.4,
							shadowRadius: 15,
							elevation: 8,
						}}
					>
						{isRunning ? (
							<Pause size={36} color="white" fill="white" />
						) : (
							<Play size={36} color="white" fill="white" x={2} />
						)}
					</LinearGradient>
				</Button>

				<Button
					circular
					size="$5"
					backgroundColor="#F3EDF7"
					onPress={onSettingsPress}
					pressStyle={{ scale: 0.9, backgroundColor: "#EADDFF" }}
					icon={<Settings2 size={24} color="#6750A4" />}
				/>
			</XStack>

			<YStack width="100%" gap="$3" paddingHorizontal="$2">
				<XStack justifyContent="space-between" alignItems="flex-end">
					<YStack>
						<Text
							fontSize="$2"
							fontWeight="800"
							color="#49454F"
							textTransform="uppercase"
							letterSpacing={0.5}
						>
							Session
						</Text>
						<Text fontSize="$5" fontWeight="900" color="#1D1B20">
							{Math.round(progress)}% Complete
						</Text>
					</YStack>
					<View
						backgroundColor="#EADDFF"
						paddingHorizontal="$3"
						paddingVertical="$1"
						borderRadius={100}
					>
						<Text fontSize="$1" fontWeight="900" color="#21005D">
							{mode === "focus" ? "FOCUS" : "BREAK"}
						</Text>
					</View>
				</XStack>
				<Progress
					value={progress}
					height={12}
					backgroundColor="#F3EDF7"
					borderRadius={100}
				>
					<Progress.Indicator backgroundColor="#6750A4" />
				</Progress>
			</YStack>
		</YStack>
	);
};

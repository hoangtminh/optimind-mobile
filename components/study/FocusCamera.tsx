import React, { useState, useEffect, useRef } from "react";
import { YStack, XStack, Text, Button, View, Circle, ZStack } from "tamagui";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Camera, CameraOff, RefreshCw, Scan, ShieldCheck } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export const FocusCamera = () => {
	const [permission, requestPermission] = useCameraPermissions();
	const [isActive, setIsActive] = useState(false);
	const [facing, setFacing] = useState<"front" | "back">("front");

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<YStack
				padding="$6"
				borderRadius={32}
				backgroundColor="white"
				alignItems="center"
				gap="$4"
				shadowColor="#000"
				shadowRadius={20}
				shadowOpacity={0.05}
			>
				<View backgroundColor="#f2ecf4" padding="$4" borderRadius={24}>
					<CameraOff size={32} color="#6750A4" />
				</View>
				<YStack alignItems="center" gap="$2">
					<Text fontSize="$5" fontWeight="800" color="#1d1b20">Camera Access Required</Text>
					<Text textAlign="center" color="#7a7582" fontSize="$3">
						We need camera access to help you stay focused during your study sessions.
					</Text>
				</YStack>
				<Button
					backgroundColor="#6750A4"
					borderRadius={16}
					onPress={requestPermission}
					width="100%"
					height={56}
				>
					<Text color="white" fontWeight="700">Grant Permission</Text>
				</Button>
			</YStack>
		);
	}

	const toggleCamera = () => setIsActive(!isActive);
	const toggleFacing = () => setFacing((prev) => (prev === "front" ? "back" : "front"));

	return (
		<YStack
			borderRadius={32}
			overflow="hidden"
			backgroundColor="white"
			shadowColor="#6750A4"
			shadowRadius={30}
			shadowOpacity={0.1}
			position="relative"
		>
			<View height={300} width="100%" backgroundColor="#1d1b20" position="relative">
				{isActive ? (
					<CameraView style={{ flex: 1 }} facing={facing}>
						<ZStack flex={1} padding="$4">
							<XStack justifyContent="space-between" width="100%">
								<View backgroundColor="rgba(0,0,0,0.5)" paddingHorizontal="$3" paddingVertical="$1" borderRadius={100}>
									<XStack gap="$2" alignItems="center">
										<Circle size={8} backgroundColor="#ff5252" />
										<Text color="white" fontSize={10} fontWeight="700">LIVE FOCUS</Text>
									</XStack>
								</View>
								<Button circular size="$3" backgroundColor="rgba(255,255,255,0.2)" onPress={toggleFacing}>
									<RefreshCw size={16} color="white" />
								</Button>
							</XStack>
							
							{/* AI Focus Ring Mockup */}
							<View flex={1} alignItems="center" justifyContent="center">
								<View 
									width={180} 
									height={180} 
									borderWidth={2} 
									borderColor="rgba(103, 80, 164, 0.5)" 
									borderRadius={100}
									borderStyle="dashed"
								/>
							</View>
						</ZStack>
					</CameraView>
				) : (
					<YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
						<View backgroundColor="rgba(255,255,255,0.1)" padding="$4" borderRadius={24}>
							<Camera size={48} color="white" opacity={0.5} />
						</View>
						<Text color="white" opacity={0.5} fontWeight="600">Camera is off</Text>
					</YStack>
				)}
			</View>

			<YStack padding="$5" gap="$4">
				<XStack justifyContent="space-between" alignItems="center">
					<YStack gap="$1">
						<Text fontSize="$5" fontWeight="800" color="#1d1b20">Focus Camera</Text>
						<XStack gap="$2" alignItems="center">
							<ShieldCheck size={14} color="#006c49" />
							<Text fontSize="$2" color="#7a7582" fontWeight="600">Privacy Protected</Text>
						</XStack>
					</YStack>
					<Button
						unstyled
						onPress={toggleCamera}
						pressStyle={{ scale: 0.95 }}
					>
						<LinearGradient
							colors={isActive ? ["#ffdad6", "#ffb4ab"] : ["#6750A4", "#4F378A"]}
							style={{
								paddingHorizontal: 24,
								height: 48,
								borderRadius: 16,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text color={isActive ? "#93000a" : "white"} fontWeight="700">
								{isActive ? "Turn Off" : "Turn On"}
							</Text>
						</LinearGradient>
					</Button>
				</XStack>
				
				<Text fontSize="$3" color="#494551" lineHeight={20}>
					Use the Focus Camera to monitor your posture and attention levels. AI-driven insights will help you maintain peak performance.
				</Text>
			</YStack>
		</YStack>
	);
};

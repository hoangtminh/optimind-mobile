import { FocusFeatureExtractor } from "@/utils/FocusFeatureExtractor";
import { Point3D, PoseState } from "@/utils/landmarkFeatures";
import { LinearGradient } from "expo-linear-gradient";
import { CameraOff, RefreshCw, Scan, ShieldCheck } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, useWindowDimensions, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useCameraPermission } from "react-native-vision-camera";
import { Button, Circle, Text, View, XStack, YStack, ZStack } from "tamagui";
import { useFaceLandmarkDetection } from "../faceLandmarkDetection";
import { MediapipeCamera } from "../faceLandmarkDetection/mediapipeCamera";
import { RunningMode } from "../faceLandmarkDetection/types";

interface FocusCameraProps {
  timerRunning: boolean;
  setTimerRunning?: (running: boolean) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  sessionKey: number;
}

const formatLabelTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const FocusCameraComponent = ({
  timerRunning,
  setTimerRunning,
  isActive,
  setIsActive,
  sessionKey,
}: FocusCameraProps) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState<"front" | "back">("front");
  const [focusScore, setFocusScore] = useState<number | null>(null);
  const [weightedScore, setWeightedScore] = useState<number | null>(null);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(true);

  const [previousPoseState, setPreviousPoseState] = useState<
    PoseState | undefined
  >(undefined);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const calculateFocusScoreRFRef = useRef<
    ((inputFeatures: number[]) => number) | null
  >(null);
  const [focusHistory, setFocusHistory] = useState<{ score: number; timeElapsed: number }[]>([]);
  const lastFaceDetectedTimeRef = useRef<number | null>(null);

  const { width } = useWindowDimensions();
  const cameraHeight = 320;

  const featureExtractor = useRef(new FocusFeatureExtractor());

  const loadModel = async () => {
    setIsLoadingModel(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    try {
      const { calculateFocusScoreRF } = await import("@/utils/FocusModelRF");

      try {
        const dummyInput = new Array(10).fill(0);
        calculateFocusScoreRF(dummyInput);
      } catch (e) {
      }

      calculateFocusScoreRFRef.current = calculateFocusScoreRF;
      setModelLoaded(true);
    } catch (error) {
      console.error("Failed to load RF model:", error);
    } finally {
      setIsLoadingModel(false);
    }
  };

  const currentScoresRef = useRef({ focus: null as number | null, weighted: null as number | null });
  const localTimeElapsedRef = useRef(0);

  useEffect(() => {
    currentScoresRef.current = { focus: focusScore, weighted: weightedScore };
  }, [focusScore, weightedScore]);

  useEffect(() => {
    if (isActive) {
      lastFaceDetectedTimeRef.current = Date.now();
    } else {
      lastFaceDetectedTimeRef.current = null;
    }
  }, [isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timerRunning) {
      interval = setInterval(() => {
        if (lastFaceDetectedTimeRef.current !== null) {
          const elapsed = Date.now() - lastFaceDetectedTimeRef.current;
          if (elapsed > 5000) {
            setTimerRunning?.(false);
            setIsActive(false);
            Alert.alert(
              "Bạn còn ở đó không?",
              "Không phát hiện khuôn mặt trong 5 giây. Hệ thống đã tạm dừng học tập.",
              [
                {
                  text: "Tôi vẫn đang học",
                  onPress: () => {
                    setIsActive(true);
                    setTimerRunning?.(true);
                  },
                },
                {
                  text: "Tạm dừng",
                  style: "cancel",
                },
              ]
            );
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timerRunning, setIsActive, setTimerRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        localTimeElapsedRef.current += 1;
        let currentScore = 0;
        if (isActive) {
          const { focus, weighted } = currentScoresRef.current;
          const score =
            modelLoaded && focus !== null
              ? focus
              : weighted !== null
                ? weighted
                : null;
          if (score !== null) {
            currentScore = score;
          }
        }
        setFocusHistory((prev) => {
          const next = [
            ...prev,
            { score: currentScore, timeElapsed: localTimeElapsedRef.current },
          ];
          if (next.length > 40) {
            next.shift();
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, modelLoaded, isActive]);

  useEffect(() => {
    setFocusHistory([]);
    localTimeElapsedRef.current = 0;
  }, [sessionKey]);

  const onCameraFrame = useCallback(
    (landmarks: Point3D[]) => {
      const result =
        featureExtractor.current.extractAndFormatForModel(landmarks);

      if (result !== null) {
        setIsCalibrating((prev) => {
          if (prev) return false;
          return prev;
        });
        const { featuresRF, detailedFeatures } = result;

        if (modelLoaded && calculateFocusScoreRFRef.current) {
          const focusProbability = calculateFocusScoreRFRef.current(featuresRF);
          setFocusScore(focusProbability * 100);
        } else {
          setFocusScore(null);
        }

        const wScore = featureExtractor.current.calculateWeightedScore(
          detailedFeatures.scaledLR,
        );

        const sigmoidScore = 1 / (1 + Math.exp(-wScore));
        const finalPercentage = sigmoidScore * 100;
        setWeightedScore(finalPercentage);
      } else {
        setIsCalibrating((prev) => {
          if (!prev) return true;
          return prev;
        });
      }
    },
    [modelLoaded],
  );

  const onResults = useCallback(
    (results: any) => {
      if (
        results.results &&
        results.results.length > 0 &&
        results.results[0].faceLandmarks &&
        results.results[0].faceLandmarks.length > 0 &&
        results.results[0].faceLandmarks[0]
      ) {
        const faceLandmarks = results.results[0].faceLandmarks[0];
        lastFaceDetectedTimeRef.current = Date.now();
        onCameraFrame(faceLandmarks);
      }
    },
    [onCameraFrame],
  );

  const onError = useCallback((error: any) => {
    console.error("[FocusCamera] MediaPipe Error:", error);
  }, []);

  const solution = useFaceLandmarkDetection(
    { onResults, onError },
    RunningMode.LIVE_STREAM,
    "face_landmarker.task",
    {
      numFaces: 1,
      fpsMode: isCalibrating ? 5 : 1,
      mirrorMode: "mirror-front-only",
    },
  );

  if (!hasPermission) {
    return (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        gap="$4"
        padding="$6"
      >
        <ShieldCheck size={48} color="#6750A4" />
        <Text fontSize="$6" fontWeight="800" textAlign="center" color="#1D1B20">
          Camera Access Required
        </Text>
        <Text fontSize="$3" color="#7A7582" textAlign="center">
          We need your camera to monitor your focus and help you stay
          productive.
        </Text>
        <Button
          backgroundColor="#6750A4"
          borderRadius={16}
          onPress={requestPermission}
        >
          <Text color="white" fontWeight="700">
            Grant Permission
          </Text>
        </Button>
      </YStack>
    );
  }

  return (
    <YStack gap="$6">
      <YStack gap="$2" paddingHorizontal="$2">
        <XStack alignItems="center" gap="$2">
          <View backgroundColor="#6750A4" padding="$1.5" borderRadius={8}>
            <Scan size={16} color="white" />
          </View>
          <Text fontSize="$4" fontWeight="800" color="#1D1B20">
            AI Focus Monitor
          </Text>
        </XStack>
        <Text
          fontSize="$2"
          fontWeight="700"
          color="#7A7582"
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          MediaPipe Facial Tracking
        </Text>
      </YStack>

      <ZStack
        width="100%"
        height={cameraHeight}
        borderRadius={40}
        overflow="hidden"
        backgroundColor="#000"
        shadowColor="#000"
        shadowRadius={30}
        shadowOpacity={0.2}
      >
        {isActive ? (
          <MediapipeCamera
            solution={solution}
            activeCamera={facing}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
            <Circle size={80} backgroundColor="rgba(103, 80, 164, 0.1)">
              <CameraOff size={32} color="#6750A4" />
            </Circle>
            <Text color="white" fontWeight="700" fontSize="$3">
              Camera is Off
            </Text>
          </YStack>
        )}

        <YStack position="absolute" top={20} left={20} gap="$2">
          <XStack
            backgroundColor={
              isActive ? "rgba(76, 175, 80, 0.9)" : "rgba(122, 117, 130, 0.8)"
            }
            paddingHorizontal="$3"
            paddingVertical="$1.5"
            borderRadius={100}
            alignItems="center"
            gap="$2"
          >
            <Circle size={8} backgroundColor="white" />
            <Text
              color="white"
              fontWeight="900"
              fontSize="$1"
              textTransform="uppercase"
            >
              {isActive
                ? isCalibrating
                  ? "Đang Lấy Calibration..."
                  : "Monitoring Active"
                : "AI Paused"}
            </Text>
          </XStack>
        </YStack>

        <XStack
          position="absolute"
          zIndex={100}
          bottom={20}
          right={20}
          gap="$3"
        >
          <Button
            circular
            size="$4"
            backgroundColor="rgba(255,255,255,0.2)"
            pressStyle={{
              scale: 0.9,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
            onPress={() => {
              featureExtractor.current.resetCalibration();
              setIsCalibrating(true);
              setFocusScore(null);
              setWeightedScore(null);
            }}
            icon={<Scan size={20} color="white" />}
          />
          <Button
            circular
            size="$4"
            backgroundColor="rgba(255,255,255,0.2)"
            pressStyle={{
              scale: 0.9,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
            onPress={() => setFacing(facing === "front" ? "back" : "front")}
            icon={<RefreshCw size={20} color="white" />}
          />
        </XStack>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
          }}
        />
      </ZStack>

      {!modelLoaded ? (
        <Button
          size="$4"
          borderRadius={24}
          backgroundColor="#EADDFF"
          onPress={loadModel}
          pressStyle={{ scale: 0.98, opacity: 0.9 }}
          disabled={isLoadingModel}
        >
          <XStack gap="$2" alignItems="center">
            <RefreshCw size={16} color="#21005D" />
            <Text fontWeight="700" color="#21005D">
              Tải Mô Hình Random Forest (AI)
            </Text>
          </XStack>
        </Button>
      ) : (
        <XStack
          justifyContent="center"
          alignItems="center"
          gap="$2"
          backgroundColor="#E8F5E9"
          padding="$2.5"
          borderRadius={100}
          alignSelf="center"
        >
          <ShieldCheck size={16} color="#2E7D32" />
          <Text fontSize="$2" fontWeight="700" color="#2E7D32">
            Đã tải mô hình Random Forest thành công
          </Text>
        </XStack>
      )}

      <Button
        size="$5"
        borderRadius={24}
        backgroundColor={isActive ? "#FFD8E4" : "#6750A4"}
        onPress={() => setIsActive(!isActive)}
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
      >
        <XStack gap="$2" alignItems="center">
          {isActive ? (
            <CameraOff size={20} color="#8C1D18" />
          ) : (
            <ShieldCheck size={20} color="white" />
          )}
          <Text fontWeight="800" color={isActive ? "#8C1D18" : "white"}>
            {isActive ? "Stop AI Monitoring" : "Start Focus AI"}
          </Text>
        </XStack>
      </Button>

      <Modal transparent={true} visible={isLoadingModel} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <YStack
            backgroundColor="white"
            padding="$6"
            borderRadius={24}
            alignItems="center"
            gap="$4"
            width={280}
          >
            <ActivityIndicator size="large" color="#6750A4" />
            <Text
              fontWeight="800"
              fontSize="$4"
              color="#1D1B20"
              textAlign="center"
            >
              Đang tải mô hình AI...
            </Text>
            <Text fontSize="$2" color="#7A7582" textAlign="center">
              Vui lòng đợi giây lát, hệ thống đang tải mô hình Random Forest.
            </Text>
          </YStack>
        </View>
      </Modal>

      {(focusScore !== null || weightedScore !== null) && (
        <YStack
          backgroundColor="#F3EDF7"
          padding="$4"
          borderRadius={16}
          gap="$2"
        >
          <Text fontWeight="bold" fontSize="$4" color="#1D1B20">
            Kết quả Real-time:
          </Text>
          {focusScore !== null && (
            <XStack justifyContent="space-between">
              <Text color="#49454F">Mô hình Random Forest:</Text>
              <Text fontWeight="bold" color="#6750A4">
                {focusScore.toFixed(2)}%
              </Text>
            </XStack>
          )}
          {weightedScore !== null && (
            <XStack justifyContent="space-between">
              <Text color="#49454F">Điểm theo trọng số:</Text>
              <Text fontWeight="bold" color="#6750A4">
                {weightedScore.toFixed(2)}%
              </Text>
            </XStack>
          )}
        </YStack>
      )}

      <YStack
        backgroundColor="#f8f2fa"
        padding="$3"
        borderRadius={24}
        gap="$2"
        borderWidth={1}
        borderColor="rgba(203, 196, 210, 0.3)"
        shadowColor="#000"
        shadowRadius={8}
        shadowOpacity={0.02}
        position="relative"
      >
        <YStack paddingLeft="$2" gap="$0.5">
          <Text fontWeight="800" fontSize="$3" color="#1D1B20">
            Biểu đồ Độ Tập Trung Live (%)
          </Text>
          <Text fontSize="$1" color="#494551">
            Theo dõi mức độ tương tác nhận thức của bạn
          </Text>
        </YStack>
        <LineChart
          data={{
            labels: focusHistory.map((item, index) => {
              if (
                index === 0 ||
                index === focusHistory.length - 1 ||
                index % 10 === 0
              ) {
                return formatLabelTime(item.timeElapsed);
              }
              return "";
            }),
            datasets: [
              {
                data: focusHistory.map((item) => item.score),
                color: (opacity = 1) => `rgba(103, 80, 164, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: [100],
                withDots: false,
                color: () => "transparent",
                strokeWidth: 0,
              },
            ],
          }}
          yAxisSuffix="%"
          width={width - 60}
          height={200}
          withDots={false}
          fromZero={true}
          segments={4}
          withVerticalLines={false}
          withHorizontalLines={true}
          chartConfig={{
            backgroundColor: "#eeee",
            backgroundGradientFrom: "#f8f2fa",
            backgroundGradientTo: "#f8f2fa",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(103, 80, 164, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(73, 69, 81, ${opacity})`,
            propsForLabels: {
              fontSize: 9,
              fontFamily: "System",
            },
            propsForBackgroundLines: {
              stroke: "rgba(203, 196, 210, 0.2)",
              strokeDasharray: "",
            },
            fillShadowGradient: "#6750a4",
            fillShadowGradientOpacity: 0.2,
            fillShadowGradientTo: "#6750a4",
            fillShadowGradientToOpacity: 0,
            useShadowColorFromDataset: false,
            style: {
              padding: 0,
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            borderRadius: 12,
            marginTop: 16,
            marginBottom: 2,
            marginLeft: -10,
            marginRight: -10,
            paddingLeft: 0,
            paddingRight: 40,
            paddingTop: 10,
            paddingBottom: 5,
          }}
        />
      </YStack>
    </YStack>
  );
};

export const FocusCamera = React.memo(FocusCameraComponent);

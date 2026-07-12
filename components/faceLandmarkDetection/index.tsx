import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  type LayoutChangeEvent,
} from "react-native";
import {
  Orientation as RNOrientation,
  useDeviceOrientation,
} from "react-native-orientation-director";
import {
  runAtTargetFps,
  useFrameProcessor,
  VisionCameraProxy,
  type CameraDevice,
  type Orientation,
} from "react-native-vision-camera";
import { useSharedValue } from "react-native-worklets-core";
import { BaseViewCoordinator } from "./convert";
import {
  Delegate,
  TransformMatrix,
  type DetectionCallbacks,
  type DetectionCallbackState,
  type DetectionError,
  type Landmark,
  type MediaPipeSolution,
  type ResizeMode,
  type RunningMode,
} from "./types";

type OrientationMode = "auto" | "portrait" | "landscape";

const { FaceLandmarkDetection } = NativeModules;
const eventEmitter = new NativeEventEmitter(FaceLandmarkDetection);

const plugin = VisionCameraProxy.initFrameProcessorPlugin(
  "faceLandmarkDetection",
  {},
);
if (!plugin) {
  throw new Error("Failed to initialize faceLandmarkDetection plugin");
}

interface FaceLandmarkDetectionModule {
  createDetector: (
    numFaces: number,
    minFaceDetectionConfidence: number,
    minFacePresenceConfidence: number,
    minTrackingConfidence: number,
    model: string,
    delegate: Delegate,
    runningMode: RunningMode,
  ) => Promise<number>;
  releaseDetector: (handle: number) => Promise<boolean>;
  detectOnImage: (
    imagePath: string,
    numFaces: number,
    minFaceDetectionConfidence: number,
    minFacePresenceConfidence: number,
    minTrackingConfidence: number,
    model: string,
    delegate: Delegate,
  ) => Promise<FaceLandmarkDetectionResultBundle>;
}

function getFaceLandmarkDetectionModule(): FaceLandmarkDetectionModule {
  if (FaceLandmarkDetection === undefined || FaceLandmarkDetection === null) {
    throw new Error("FaceLandmarkDetection module is not available");
  }
  return FaceLandmarkDetection as FaceLandmarkDetectionModule;
}

export interface FaceLandmarkDetectionResultBundle {
  results: FaceLandmarkerResult[];
  inferenceTime: number;
  inputImageHeight: number;
  inputImageWidth: number;
}

interface Category {
  categoryName?: string;
  displayName?: string;
  score: number;
}

interface Classifications {
  headIndex: number;
  headName?: string;
  categories: Category[];
}

export interface FaceLandmarkerResult {
  faceLandmarks: Landmark[][];
  rawFaceLandmarks?: Landmark[][];
  trackingFaceLandmarks?: Landmark[][];
  faceBlendshapes: Classifications[];
  facialTransformationMatrixes: TransformMatrix[];
}

type FpsMode = "none" | number;

export interface FaceLandmarkDetectionOptions {
  numFaces: number;
  minFaceDetectionConfidence: number;
  minFacePresenceConfidence: number;
  minTrackingConfidence: number;
  delegate: Delegate;
  mirrorMode: "no-mirror" | "mirror" | "mirror-front-only";
  fpsMode?: FpsMode;
  orientationMode?: OrientationMode;
}

type FaceLandmarkCallbackState =
  DetectionCallbackState<FaceLandmarkDetectionResultBundle> & {
    trackingViewCoordinator: BaseViewCoordinator;
  };

const detectorMap = new Map<number, FaceLandmarkCallbackState>();

eventEmitter.addListener(
  "onResults",
  (
    args: {
      handle: number;
      orientation?: string;
    } & FaceLandmarkDetectionResultBundle,
  ) => {
    const callbacks = detectorMap.get(args.handle);
    if (callbacks) {
      if (args.results) {
        args.results = args.results.map((result) => {
          if (result.faceLandmarks) {
            return {
              ...result,
              rawFaceLandmarks: result.faceLandmarks,
              trackingFaceLandmarks: result.faceLandmarks.map((landmarks) =>
                landmarks.map((landmark) => {
                  const converted =
                    callbacks.trackingViewCoordinator.convertNormalizedPoint({
                      x: landmark.x,
                      y: landmark.y,
                    });
                  return {
                    ...landmark,
                    x: converted.x,
                    y: converted.y,
                  };
                }),
              ),
              faceLandmarks: result.faceLandmarks.map((landmarks) =>
                landmarks.map((landmark) => {
                  const converted = callbacks.viewCoordinator
                    .convertNormalizedPoint
                    ? callbacks.viewCoordinator.convertNormalizedPoint({
                        x: landmark.x,
                        y: landmark.y,
                      })
                    : { x: landmark.x, y: landmark.y };
                  return {
                    ...landmark,
                    x: converted.x,
                    y: converted.y,
                  };
                }),
              ),
            };
          }
          return result;
        });
      }
      callbacks.onResults(args, callbacks.viewCoordinator);
    }
  },
);

eventEmitter.addListener(
  "onError",
  (args: { handle: number } & DetectionError) => {
    const callbacks = detectorMap.get(args.handle);
    if (callbacks) {
      callbacks.onError(args);
    }
  },
);

export function useFaceLandmarkDetection(
  callbacks: DetectionCallbacks<FaceLandmarkDetectionResultBundle>,
  runningMode: RunningMode,
  model: string,
  options?: Partial<FaceLandmarkDetectionOptions>,
): MediaPipeSolution {
  const [detectorHandle, setDetectorHandle] = useState<number | undefined>();
  const [cameraViewDimensions, setCameraViewDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 1, height: 1 });

  const outputOrientation = useSharedValue<RNOrientation>(
    RNOrientation.portrait,
  );
  const displayFrameOrientation = useSharedValue<RNOrientation>(
    RNOrientation.portrait,
  );
  const trackingFrameOrientation = useSharedValue<RNOrientation>(
    RNOrientation.portrait,
  );

  const deviceOrientation = useDeviceOrientation();

  const cameraViewLayoutChangeHandler = useCallback(
    (event: LayoutChangeEvent) => {
      setCameraViewDimensions({
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      });
    },
    [],
  );

  const mirrorMode =
    options?.mirrorMode ??
    Platform.select({ android: "mirror-front-only", default: "no-mirror" });

  const [cameraDevice, setCameraDevice] = useState<CameraDevice | undefined>();
  const [resizeMode, setResizeMode] = useState<ResizeMode>("cover");

  const mirrored = useMemo((): boolean => {
    return (
      (mirrorMode === "mirror-front-only" &&
        cameraDevice?.position === "front") ||
      mirrorMode === "mirror"
    );
  }, [cameraDevice?.position, mirrorMode]);

  const updateDetectorMap = useCallback(() => {
    if (detectorHandle !== undefined) {
      const viewCoordinator = new BaseViewCoordinator(
        cameraViewDimensions,
        mirrored,
        displayFrameOrientation.value,
        outputOrientation.value,
        resizeMode,
      );
      const trackingViewCoordinator = new BaseViewCoordinator(
        cameraViewDimensions,
        false,
        trackingFrameOrientation.value,
        outputOrientation.value,
        resizeMode,
      );
      detectorMap.set(detectorHandle, {
        onResults: callbacks.onResults,
        onError: callbacks.onError,
        viewCoordinator,
        trackingViewCoordinator,
      });
    }
  }, [
    cameraViewDimensions,
    detectorHandle,
    displayFrameOrientation.value,
    mirrored,
    callbacks.onError,
    callbacks.onResults,
    outputOrientation.value,
    resizeMode,
    trackingFrameOrientation.value,
  ]);

  const getTrackingFrameRNOrientation = useCallback(
    (devOrient: RNOrientation, mode: OrientationMode) => {
      if (mode === "portrait") {
        return RNOrientation.portrait;
      }
      if (mode === "landscape") {
        return RNOrientation.landscapeLeft;
      }
      return devOrient;
    },
    [],
  );

  useEffect(() => {
    const mode = options?.orientationMode ?? "auto";
    outputOrientation.value = RNOrientation.portrait;
    displayFrameOrientation.value =
      mode === "auto" ? deviceOrientation : RNOrientation.portrait;
    trackingFrameOrientation.value = getTrackingFrameRNOrientation(
      deviceOrientation,
      mode,
    );
    updateDetectorMap();
  }, [
    deviceOrientation,
    options?.orientationMode,
    updateDetectorMap,
    getTrackingFrameRNOrientation,
  ]);

  useLayoutEffect(() => {
    updateDetectorMap();
  }, [updateDetectorMap]);

  useEffect(() => {
    let newHandle: number | undefined;
    getFaceLandmarkDetectionModule()
      .createDetector(
        options?.numFaces ?? 1,
        options?.minFaceDetectionConfidence ?? 0.4,
        options?.minFacePresenceConfidence ?? 0.5,
        options?.minTrackingConfidence ?? 0.5,
        model,
        options?.delegate ?? Delegate.GPU,
        runningMode,
      )
      .then((handle) => {
        setDetectorHandle(handle);
        newHandle = handle;
      });
    return () => {
      if (newHandle !== undefined) {
        getFaceLandmarkDetectionModule().releaseDetector(newHandle);
      }
    };
  }, [
    options?.delegate,
    runningMode,
    model,
    options?.numFaces,
    options?.minFaceDetectionConfidence,
    options?.minFacePresenceConfidence,
    options?.minTrackingConfidence,
  ]);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      const fpsMode = options?.fpsMode ?? "none";

      const processFrame = () => {
        const orientationMode = options?.orientationMode ?? "auto";
        let orientationStr: Orientation = "portrait";

        if (orientationMode === "portrait") {
          orientationStr =
            deviceOrientation === 3 ? "portrait-upside-down" : "portrait";
          console.log("portrait", orientationStr);
        } else if (orientationMode === "landscape") {
          orientationStr =
            deviceOrientation === 2 ? "landscape-right" : "landscape-left";
          console.log("landscape", orientationStr);
        } else {
          console.log("other");
          switch (deviceOrientation) {
            case 1:
              orientationStr = "portrait";
              break;
            case 3:
              orientationStr = "portrait-upside-down";
              break;
            case 4:
              orientationStr = "landscape-left";
              break;
            case 2:
              orientationStr = "landscape-right";
              break;
          }
        }

        plugin?.call(frame, {
          detectorHandle,
          orientation: orientationStr,
        });
      };
      if (fpsMode === "none") {
        processFrame();
      } else {
        runAtTargetFps(fpsMode, processFrame);
      }
    },
    [detectorHandle, options?.fpsMode, deviceOrientation],
  );

  return useMemo(
    (): MediaPipeSolution => ({
      cameraViewLayoutChangeHandler,
      cameraDeviceChangeHandler: (d) => {
        setCameraDevice(d);
      },
      resizeModeChangeHandler: setResizeMode,
      cameraViewDimensions,
      frameProcessor,
    }),
    [cameraViewDimensions, cameraViewLayoutChangeHandler, frameProcessor],
  );
}

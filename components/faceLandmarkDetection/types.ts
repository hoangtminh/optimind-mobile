import type { LayoutChangeEvent } from "react-native";
import type {
	CameraDevice,
	Orientation,
	ReadonlyFrameProcessor,
} from "react-native-vision-camera";

export type Dims = { width: number; height: number };
export type Point = { x: number; y: number };
export type RectXYWH = { x: number; y: number; width: number; height: number };
export type RectLTRB = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
export type ResizeMode = "cover" | "contain";

export type ImageOrientation = Orientation;

export interface MediaPipeSolution {
  frameProcessor: ReadonlyFrameProcessor;
  cameraViewLayoutChangeHandler: (event: LayoutChangeEvent) => void;
  cameraDeviceChangeHandler: (device: CameraDevice | undefined) => void;
  cameraViewDimensions: { width: number; height: number };
  resizeModeChangeHandler: (resizeMode: ResizeMode) => void;
}

// eslint-disable-next-line no-restricted-syntax
export enum Delegate {
  CPU = 0,
  GPU = 1,
}

// eslint-disable-next-line no-restricted-syntax
export enum RunningMode {
  IMAGE = 0,
  VIDEO = 1,
  LIVE_STREAM = 2,
}

export interface DetectionError {
  code: number;
  message: string;
}

export interface FrameProcessInfo {
  inferenceTime: number;
  inputImageHeight: number;
  inputImageWidth: number;
}

export interface DetectionResultBundle<TResult> extends FrameProcessInfo {
  results: TResult[];
}

export interface ViewCoordinator {
  getFrameDims: (info: FrameProcessInfo) => Dims;
  convertPoint: (frame: Dims, p: Point) => Point;
}

export interface DetectionCallbacks<TResultBundle> {
  onResults: (result: TResultBundle, vc: ViewCoordinator) => void;
  onError: (error: DetectionError) => void;
}

export interface DetectionCallbackState<
  TResultBundle,
> extends DetectionCallbacks<TResultBundle> {
  viewCoordinator: ViewCoordinator;
}

// Interface for a normalized landmark point in 3D space
export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number; // Optional as it might not be supported
  presence?: number; // Optional as it might not be supported
}

// Interface for the transformation matrix
export interface TransformMatrix {
  rows: number;
  columns: number;
  data: number[];
}

export function orientationToRotation(orientation: Orientation): number {
  switch (orientation) {
    case "landscape-left":
      return -90;
    case "portrait":
      return 0;
    case "landscape-right":
      return 90;
    case "portrait-upside-down":
      return 180;
  }
}

export function dimsByOrientation(
  orientation: Orientation,
  width: number,
  height: number,
): Dims {
  return orientation === "portrait" || orientation === "portrait-upside-down"
    ? { width, height }
    : { width: height, height: width };
}

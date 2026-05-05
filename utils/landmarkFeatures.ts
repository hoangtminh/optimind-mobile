export interface Point3D {
  x: number;
  y: number;
  z?: number;
}

// Euclidean distance between two points
const distance = (p1: Point3D, p2: Point3D): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// 1. Eye Aspect Ratio (EAR)
export const calculateEAR = (landmarks: Point3D[]): number => {
  if (!landmarks || landmarks.length < 468) return 0;

  // Left Eye Landmarks:
  // Horizontal: 33 -> 133
  // Vertical 1: 160 -> 144
  // Vertical 2: 158 -> 153
  const leftHorizontal = distance(landmarks[33], landmarks[133]);
  const leftVertical1 = distance(landmarks[160], landmarks[144]);
  const leftVertical2 = distance(landmarks[158], landmarks[153]);
  const leftEAR = (leftVertical1 + leftVertical2) / (2.0 * leftHorizontal);

  // Right Eye Landmarks:
  // Horizontal: 362 -> 263
  // Vertical 1: 385 -> 380
  // Vertical 2: 387 -> 373
  const rightHorizontal = distance(landmarks[362], landmarks[263]);
  const rightVertical1 = distance(landmarks[385], landmarks[380]);
  const rightVertical2 = distance(landmarks[387], landmarks[373]);
  const rightEAR = (rightVertical1 + rightVertical2) / (2.0 * rightHorizontal);

  // Average EAR
  return (leftEAR + rightEAR) / 2.0;
};

// 2. Mouth Aspect Ratio (MAR)
export const calculateMAR = (landmarks: Point3D[]): number => {
  if (!landmarks || landmarks.length < 468) return 0;

  // Mouth Landmarks:
  // Horizontal: 61 (left corner) -> 291 (right corner)
  // Vertical: 0 (upper lip) -> 17 (lower lip) - outer
  // Inner vertical: 13 -> 14
  
  const horizontal = distance(landmarks[61], landmarks[291]);
  const vertical = distance(landmarks[13], landmarks[14]); // Using inner lips for better open/close detection
  
  if (horizontal === 0) return 0;
  return vertical / horizontal;
};

// 3. Head Pose (Yaw, Pitch, Roll) - Approximations
export const calculateHeadPose = (landmarks: Point3D[]) => {
  if (!landmarks || landmarks.length < 468) return { pitch: 0, yaw: 0, roll: 0 };

  const noseTip = landmarks[1];
  const chin = landmarks[152];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const leftMouth = landmarks[61];
  const rightMouth = landmarks[291];

  // Roll: Angle of the line connecting eyes
  const deltaY = rightEye.y - leftEye.y;
  const deltaX = rightEye.x - leftEye.x;
  const roll = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  // Pitch approximation using the z-coordinates (depth) or ratio of facial features
  // Simple approximation: ratio of distance from nose to chin vs nose to eyes
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;
  const faceHeight = chin.y - eyeCenterY;
  const noseToChin = chin.y - noseTip.y;
  // Baseline ratio is roughly 0.5. Deviations imply pitch.
  const pitchRatio = faceHeight > 0 ? noseToChin / faceHeight : 0.5;
  const pitch = (pitchRatio - 0.5) * 180; // Scaled approximation

  // Yaw approximation: left/right symmetry
  const faceWidth = rightEye.x - leftEye.x;
  const noseToLeftEye = noseTip.x - leftEye.x;
  const yawRatio = faceWidth > 0 ? noseToLeftEye / faceWidth : 0.5;
  const yaw = (yawRatio - 0.5) * 180; // Scaled approximation

  return { pitch, yaw, roll };
};

// 4. Gaze Estimation (X, Y)
export const calculateGaze = (landmarks: Point3D[]) => {
  // Requires Iris landmarks (468-477)
  if (!landmarks || landmarks.length < 478) return { gazeX: 0, gazeY: 0 };

  const leftEyeLeftCorner = landmarks[33];
  const leftEyeRightCorner = landmarks[133];
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const leftIrisCenter = landmarks[468];

  const eyeWidth = leftEyeRightCorner.x - leftEyeLeftCorner.x;
  const eyeHeight = leftEyeBottom.y - leftEyeTop.y;

  // Normalized gaze X/Y within the eye bounding box (-1 to 1)
  const gazeX = eyeWidth > 0 ? ((leftIrisCenter.x - leftEyeLeftCorner.x) / eyeWidth) * 2 - 1 : 0;
  const gazeY = eyeHeight > 0 ? ((leftIrisCenter.y - leftEyeTop.y) / eyeHeight) * 2 - 1 : 0;

  return { gazeX, gazeY };
};

// Interface for storing previous state to calculate deltas
export interface PoseState {
  pitch: number;
  yaw: number;
}

// 5. Aggregate Feature Calculator
export const extractFeatures = (landmarks: Point3D[], prevState?: PoseState) => {
  const ear = calculateEAR(landmarks);
  const mar = calculateMAR(landmarks);
  const { pitch, yaw, roll } = calculateHeadPose(landmarks);
  const { gazeX, gazeY } = calculateGaze(landmarks);

  // Deltas for head movement
  const prevPitch = prevState?.pitch ?? pitch;
  const prevYaw = prevState?.yaw ?? yaw;
  
  const pitchDelta = pitch - prevPitch;
  const yawDelta = yaw - prevYaw;

  const features = {
    EAR: ear,
    EAR_Ratio: ear, // Synonymous in this context, or could be baseline normalized
    EAR_squared: ear * ear,
    
    MAR_Ratio: mar,
    
    Yaw: yaw,
    Pitch: pitch,
    Roll: roll,
    Yaw_squared: yaw * yaw,
    Pitch_squared: pitch * pitch,
    
    Head_Movement_Pitch: Math.abs(pitchDelta),
    Head_Movement_Yaw: Math.abs(yawDelta),
    Head_Movement_Total: Math.abs(pitchDelta) + Math.abs(yawDelta),
    Pitch_Delta_squared: pitchDelta * pitchDelta,
    Yaw_Delta_squared: yawDelta * yawDelta,
    
    Gaze_X: gazeX,
    Gaze_Y: gazeY,
  };

  // The new state to pass into the next frame
  const newState: PoseState = { pitch, yaw };

  return { features, newState };
};

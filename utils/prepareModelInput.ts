// Thay đổi đường dẫn import cho phù hợp với dự án của bạn

import { extractFeatures, Point3D, PoseState } from "./landmarkFeatures";

/**
 * Trích xuất đặc trưng từ landmarks và format thành mảng input cho Random Forest Model
 * Thứ tự mảng: [EAR_Ratio, MAR_Ratio, Yaw, Pitch, Roll, Head_Movement_Total, Pitch_Delta_squared, Yaw_Delta_squared, Gaze_X, Gaze_Y]
 *
 * @param landmarks Mảng các điểm FaceLandmarks {x, y, z}
 * @param prevState Trạng thái Yaw/Pitch của frame trước đó (để tính Delta/Movement)
 * @returns Object chứa mảng input cho mô hình và newState để dùng cho frame tiếp theo
 */
export const prepareFocusModelInput = (
  landmarks: Point3D[],
  prevState?: PoseState,
): { modelInput: number[]; newState: PoseState } => {
  // 1. Trích xuất toàn bộ các đặc trưng và trạng thái mới
  const { features, newState } = extractFeatures(landmarks, prevState);

  // 2. Map dữ liệu vào mảng theo đúng thứ tự Index của features_rf
  const modelInput: number[] = [
    features.EAR_Ratio, // [0]
    features.MAR_Ratio, // [1]
    features.Yaw, // [2]
    features.Pitch, // [3]
    features.Roll, // [4]
    features.Head_Movement_Total, // [5]
    features.Pitch_Delta_squared, // [6]
    features.Yaw_Delta_squared, // [7]
    features.Gaze_X, // [8]
    features.Gaze_Y, // [9]
  ];

  return { modelInput, newState };
};

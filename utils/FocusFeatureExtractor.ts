export interface Point3D {
  x: number;
  y: number;
  z?: number;
}

/**
 * CẤU HÌNH SCALER TỪ PYTHON (StandardScaler)
 * Dùng để chuẩn hóa dữ liệu cho Logistic Regression.
 * Thứ tự mảng: [EAR, EAR_sq, Yaw_sq, Pitch_sq, HM_Yaw, HM_Pitch, Roll, Gaze_X, Gaze_Y]
 */
const SCALER_CONFIG = {
  mean: [
    0.3486902291282592, 0.1280882842164867, 36.62934468001053,
    23698.57250904662, 5.04353272320253, 4.309748187165306, -1.7958612062154333,
    0.4504962602054253, 0.4342296154859099,
  ],
  scale: [
    0.08064371225934996, 0.04907273551250861, 91.86614530736448,
    2826.6756504189225, 34.40090865602092, 20.779944381425082,
    8.846022413409603, 0.041384301779005796, 0.06469122843788308,
  ],
};

const LR_COEFFICIENTS = [
  0.7576, // 0: EAR (Tăng tập trung +)
  -0.1697, // 1: EAR_sq (Xao nhãng -)
  -0.3961, // 2: Yaw_sq (Xao nhãng -)
  -0.1931, // 3: Pitch_sq (Xao nhãng -)
  -0.5559, // 4: HM_Yaw (Xao nhãng -)
  -0.2996, // 5: HM_Pitch (Xao nhãng -)
  0.1267, // 6: Roll (Tăng tập trung +)
  0.0751, // 7: Gaze_X (Tăng tập trung +)
  -0.0342, // 8: Gaze_Y (Xao nhãng -)
];

// Lấy giá trị này từ log_model.intercept_[0] trong Python
const LR_INTERCEPT = 0.5; // Bạn hãy thay số đúng từ Python vào đây

const distance2D = (p1: Point3D, p2: Point3D): number => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

const calculateVariance = (arr: number[]): number => {
  if (arr.length <= 1) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  // Công thức n-1 khớp hoàn toàn với pandas.var() và numpy.var(ddof=1)
  return arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (arr.length - 1);
};

export class FocusFeatureExtractor {
  private isCalibrated: boolean = false;
  private calibrationFrames: number = 0;
  private readonly CALIBRATION_LIMIT: number = 10;

  private sumEAR: number = 0;
  private sumMAR: number = 0;
  private sumPitch: number = 0;
  private sumYaw: number = 0;

  private baseEAR: number = 0.001;
  private baseMAR: number = 0.001;
  private basePitch: number = 0;
  private baseYaw: number = 0;

  private historyPitchDelta: number[] = [];
  private historyYawDelta: number[] = [];

  constructor() {}

  public resetCalibration() {
    this.isCalibrated = false;
    this.calibrationFrames = 0;
    this.sumEAR = 0;
    this.sumMAR = 0;
    this.sumPitch = 0;
    this.sumYaw = 0;
    this.historyPitchDelta = [];
    this.historyYawDelta = [];
  }

  /**
   * Áp dụng công thức (x - mean) / scale để chuẩn hóa dữ liệu
   */
  private applyStandardScaler(features: number[]): number[] {
    return features.map((val, i) => {
      const m = SCALER_CONFIG.mean[i];
      const s = SCALER_CONFIG.scale[i];
      return (val - m) / s;
    });
  }

  public extractAndFormatForModel(
    landmarks: Point3D[],
  ): { featuresRF: number[]; detailedFeatures: any } | null {
    if (!landmarks || landmarks.length < 478) return null;

    // 1. EAR (Mắt)
    const lEar =
      (distance2D(landmarks[160], landmarks[144]) +
        distance2D(landmarks[158], landmarks[153])) /
      (2 * distance2D(landmarks[33], landmarks[133]));
    const rEar =
      (distance2D(landmarks[385], landmarks[380]) +
        distance2D(landmarks[387], landmarks[373])) /
      (2 * distance2D(landmarks[362], landmarks[263]));
    const ear = (lEar + rEar) / 2.0;

    // 2. MAR (Miệng)
    const mar =
      distance2D(landmarks[13], landmarks[14]) /
      distance2D(landmarks[78], landmarks[308]);

    // 3. Gaze Ratio
    const dx_total = distance2D(landmarks[133], landmarks[33]);
    const dx_iris = distance2D(landmarks[468], landmarks[33]);
    const gazeX = dx_total > 0 ? dx_iris / dx_total : 0.5;

    const dy_total = distance2D(landmarks[159], landmarks[145]);
    const dy_iris = distance2D(landmarks[468], landmarks[159]);
    const gazeY = dy_total > 0 ? dy_iris / dy_total : 0.5;

    // 4. Head Pose
    const yawRaw =
      Math.atan2(
        (landmarks[454].z || 0) - (landmarks[234].z || 0),
        landmarks[454].x - landmarks[234].x,
      ) *
      (180 / Math.PI);
    // FIX YAW WRAPPING: Ép góc về quanh 0 độ
    let yaw = yawRaw;
    if (yaw > 90) yaw -= 180;
    else if (yaw < -90) yaw += 180;
    let pitchRaw =
      Math.atan2(
        (landmarks[1].z || 0) - (landmarks[152].z || 0),
        landmarks[1].y - landmarks[152].y,
      ) *
      (180 / Math.PI);
    const pitch = pitchRaw > 0 ? pitchRaw - 360 : pitchRaw;
    const roll =
      Math.atan2(
        landmarks[263].y - landmarks[33].y,
        landmarks[263].x - landmarks[33].x,
      ) *
      (180 / Math.PI);

    if (!this.isCalibrated) {
      this.sumEAR += ear;
      this.sumMAR += mar;
      this.sumPitch += pitch;
      this.sumYaw += yaw;
      this.calibrationFrames++;

      if (this.calibrationFrames >= this.CALIBRATION_LIMIT) {
        this.baseEAR = this.sumEAR / this.CALIBRATION_LIMIT || 0.001;
        this.baseMAR = this.sumMAR / this.CALIBRATION_LIMIT || 0.001;
        this.basePitch = this.sumPitch / this.CALIBRATION_LIMIT;
        this.baseYaw = this.sumYaw / this.CALIBRATION_LIMIT;
        this.isCalibrated = true;
      }
      return null;
    }

    const earRatio = ear / this.baseEAR;
    const marRatio = mar / this.baseMAR;
    const pitchDelta = pitch - this.basePitch;
    const yawDelta = yaw - this.baseYaw;

    // Rolling Variance (Window = 3 frames)
    this.historyPitchDelta.push(pitchDelta);
    this.historyYawDelta.push(yawDelta);
    if (this.historyPitchDelta.length > 3) {
      this.historyPitchDelta.shift();
      this.historyYawDelta.shift();
    }

    const headMovementPitch = calculateVariance(this.historyPitchDelta);
    const headMovementYaw = calculateVariance(this.historyYawDelta);
    const headMovementTotal = headMovementPitch + headMovementYaw;

    // NHÓM 1: CHUẨN BỊ CHO LOGISTIC REGRESSION (Dữ liệu thô cần Scale)
    // Đặc trưng: [EAR, EAR_sq, Yaw_sq, Pitch_sq, HM_Yaw, HM_Pitch, Roll, Gaze_X, Gaze_Y]
    const rawLR = [
      ear,
      Math.pow(ear, 2),
      Math.pow(yaw, 2),
      Math.pow(pitch, 2),
      headMovementYaw,
      headMovementPitch,
      roll,
      gazeX,
      gazeY,
    ];
    // Áp dụng Scaler
    const scaledLR = this.applyStandardScaler(rawLR);

    // NHÓM 2: CHUẨN BỊ CHO RANDOM FOREST (Giữ nguyên yêu cầu của bạn)
    const featuresRF: number[] = [
      earRatio,
      marRatio,
      yaw,
      pitch,
      roll,
      headMovementTotal,
      Math.pow(pitchDelta, 2),
      Math.pow(yawDelta, 2),
      gazeX,
      gazeY,
    ];

    return {
      featuresRF,
      detailedFeatures: {
        scaledLR, // ĐÂY LÀ GIÁ TRỊ DÙNG CHO LOGISTIC REGRESSION
        headMovementYaw,
        ear,
        yawSquared: Math.pow(yaw, 2),
        headMovementPitch,
        pitchSquared: Math.pow(pitch, 2),
        earSquared: Math.pow(ear, 2),
        roll: roll,
        gazeX,
        gazeY,
      },
    };
  }

  public calculateWeightedScore(scaledLR: number[]): number {
    if (!scaledLR || scaledLR.length !== LR_COEFFICIENTS.length) return 0;

    // Công thức: z = w1*x1 + w2*x2 + ... + bias
    let z = LR_INTERCEPT;
    for (let i = 0; i < LR_COEFFICIENTS.length; i++) {
      z += LR_COEFFICIENTS[i] * scaledLR[i];
    }

    return z; // Giá trị z bây giờ sẽ chỉ loanh quanh từ -10 đến 10
  }
}


export interface CalculationResult {
  id: string;
  timestamp: number;
  batchName: string;
  targetVolume: number; // Tổng thể tích mong muốn (kg)
  sourceConcentration: number; // 60%
  targetConcentration: number; // 6%
  acidVolumeNeeded: number; // Lượng axit 60% cần (kg)
  waterVolumeNeeded: number; // Lượng nước cần (kg)
  checklistCompleted: boolean;
  checklistCompletedAt?: number;
  note?: string;
}

export interface DilutionConfig {
  sourceConcentration: number;
  targetConcentration: number;
}

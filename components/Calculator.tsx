
import React, { useState } from 'react';
import { CalculationResult } from '../types';

interface CalculatorProps {
  onSave: (result: CalculationResult) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onSave }) => {
  const [inputHeight, setInputHeight] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    target: { cm: number; kg: number };
    acid: { cm: number; kg: number };
    water: { cm: number; kg: number };
  } | null>(null);

  const handleCalculate = () => {
    const h = parseFloat(inputHeight);
    
    // Reset error
    setError(null);

    if (isNaN(h)) {
      setError("Vui lòng nhập số hợp lệ");
      return;
    }

    if (h < 1) {
      setError("CÒN AXIT MÀ PHA CÁI GÌ");
      setResults(null);
      return;
    }

    if (h > 175) {
      setError("TRÀN BỒN TÙM LUM");
      setResults(null);
      return;
    }

    // Logic tính toán khối lượng (kg) - làm tròn nguyên
    const totalKg = h * 3.14 * 5.79;
    const waterKg = h * 3.14 * 5.21;
    const acidKg = totalKg - waterKg;

    const roundedTotalKg = Math.round(totalKg);
    const roundedWaterKg = Math.round(waterKg);
    const roundedAcidKg = roundedTotalKg - roundedWaterKg;

    // Logic tính toán chiều cao (cm) - làm tròn 1 số thập phân
    const totalCm = Number(h.toFixed(1));
    const waterCm = Number((totalCm * (5.21 / 5.79)).toFixed(1));
    const acidCm = Number((totalCm - waterCm).toFixed(1));

    const newResults = {
      target: { cm: totalCm, kg: roundedTotalKg },
      acid: { cm: acidCm, kg: roundedAcidKg },
      water: { cm: waterCm, kg: roundedWaterKg }
    };

    setResults(newResults);

    const record: CalculationResult = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      batchName: `Mẻ pha ${totalCm.toFixed(1)}cm`,
      targetVolume: roundedTotalKg,
      sourceConcentration: 60,
      targetConcentration: 6,
      acidVolumeNeeded: roundedAcidKg,
      waterVolumeNeeded: roundedWaterKg,
      checklistCompleted: false
    };
    onSave(record);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#efe9f4] rounded-[2rem] p-8 shadow-xl text-center border border-white/60 relative">
        <h2 className="text-[#5a5a5a] text-xl font-bold uppercase mb-6 tracking-tight">
          Chiều cao rỗng bồn axit 6%
        </h2>
        
        <div className="relative mb-4">
          <input
            type="number"
            step="0.1"
            value={inputHeight}
            onChange={(e) => {
              setInputHeight(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            placeholder="Nhập 1 - 175 (cm)"
            className={`w-full bg-transparent border-b-2 text-center text-3xl py-2 outline-none placeholder:text-slate-300 font-bold text-black transition-colors ${error ? 'border-red-500' : 'border-[#ef4a2c]'}`}
          />
          {error && (
            <div className="absolute left-0 right-0 -bottom-8 animate-bounce">
              <span className="text-red-600 text-xs font-black uppercase tracking-tighter bg-red-50 px-3 py-1 rounded-full shadow-sm border border-red-100">
                ⚠️ {error}
              </span>
            </div>
          )}
        </div>

        <div className="mt-12">
          <button
            onClick={handleCalculate}
            className="bg-[#ef4a2c] text-white text-2xl font-black py-4 px-12 rounded-full shadow-lg active:scale-95 transition-all tracking-widest uppercase hover:brightness-110"
          >
            TÍNH TOÁN
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <h3 className="text-[#333] text-lg font-bold uppercase tracking-widest py-2">Kết quả pha chế</h3>
      </div>

      <div className="space-y-5">
        <div className="bg-[#efe9f4] rounded-[1.5rem] p-6 shadow-md text-center border border-white/60 transition-all hover:scale-[1.02]">
          <h4 className="text-[#ef4a2c] text-xl font-bold uppercase mb-2 tracking-wide">Axit 6% cần pha</h4>
          <p className="text-[#333] text-2xl font-black">
            {results ? `${results.target.cm.toFixed(1)} cm | ${results.target.kg} kg` : "-- cm | -- kg"}
          </p>
        </div>

        <div className="bg-[#efe9f4] rounded-[1.5rem] p-6 shadow-md text-center border border-white/60 transition-all hover:scale-[1.02]">
          <h4 className="text-[#ef4a2c] text-xl font-bold uppercase mb-2 tracking-wide">Axit 60% cần bơm</h4>
          <p className="text-[#333] text-2xl font-black">
            {results ? `${results.acid.cm.toFixed(1)} cm | ${results.acid.kg} kg` : "-- cm | -- kg"}
          </p>
        </div>

        <div className="bg-[#efe9f4] rounded-[1.5rem] p-6 shadow-md text-center border border-white/60 transition-all hover:scale-[1.02]">
          <h4 className="text-[#00a651] text-xl font-bold uppercase mb-2 tracking-wide">Nước RO cần bơm</h4>
          <p className="text-[#333] text-2xl font-black">
            {results ? `${results.water.cm.toFixed(1)} cm | ${results.water.kg} kg` : "-- cm | -- kg"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

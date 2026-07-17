import { Criteria, TopsisResult, WargaDTO } from "./types";

function sortCriteria(criteria: Criteria[]) {
  return [...criteria].sort((a, b) => {
    const aNum = Number(a.code.replace(/\D/g, ""));
    const bNum = Number(b.code.replace(/\D/g, ""));
    return aNum - bNum;
  });
}

function toNumber(value: unknown): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function round(value: number, digits = 8): number {
  return Number(value.toFixed(digits));
}

function roundRecord(record: Record<string, number>) {
  const result: Record<string, number> = {};
  Object.keys(record).forEach((key) => {
    result[key] = round(record[key]);
  });
  return result;
}

type MatrixRow = WargaDTO & {
  values: Record<string, number>;
};

export function calculateTOPSIS(wargaList: WargaDTO[], criteriaInput: Criteria[]) {
  const criteria = sortCriteria(criteriaInput);
  const codes = criteria.map((item) => item.code);

  const assessed = wargaList.filter((item) => {
    if (!item.scores) return false;
    return codes.every((code) => {
      const value = toNumber(item.scores[code]);
      return value > 0;
    });
  });

  if (assessed.length === 0 || criteria.length === 0) {
    return {
      assessed: [],
      weightSum: 0,
      normalizedWeights: {},
      decisionMatrix: [],
      divisor: {},
      normalized: [],
      weighted: [],
      idealPositive: {},
      idealNegative: {},
      distances: [],
      results: [] as TopsisResult[],
    };
  }

  const weightSum = criteria.reduce((sum, criterion) => sum + toNumber(criterion.weight), 0) || 1;

  const normalizedWeights: Record<string, number> = {};
  criteria.forEach((criterion) => {
    normalizedWeights[criterion.code] = toNumber(criterion.weight) / weightSum;
  });

  const decisionMatrix: MatrixRow[] = assessed.map((row) => {
    const values: Record<string, number> = {};
    codes.forEach((code) => {
      values[code] = toNumber(row.scores[code]);
    });
    return { ...row, values };
  });

  const divisor: Record<string, number> = {};
  codes.forEach((code) => {
    const totalPow = decisionMatrix.reduce((sum, row) => sum + Math.pow(toNumber(row.values[code]), 2), 0);
    divisor[code] = Math.sqrt(totalPow) || 1;
  });

  const normalizedRaw: MatrixRow[] = decisionMatrix.map((row) => {
    const values: Record<string, number> = {};
    codes.forEach((code) => {
      values[code] = toNumber(row.values[code]) / (divisor[code] || 1);
    });
    return { ...row, values };
  });

  const weightedRaw: MatrixRow[] = normalizedRaw.map((row) => {
    const values: Record<string, number> = {};
    criteria.forEach((criterion) => {
      const code = criterion.code;
      values[code] = toNumber(row.values[code]) * toNumber(normalizedWeights[code]);
    });
    return { ...row, values };
  });

  const idealPositiveRaw: Record<string, number> = {};
  const idealNegativeRaw: Record<string, number> = {};

  criteria.forEach((criterion) => {
    const code = criterion.code;
    const type = String(criterion.type).toLowerCase().trim();
    const values = weightedRaw.map((row) => row.values[code]);

    if (type === "benefit") {
      idealPositiveRaw[code] = Math.max(...values);
      idealNegativeRaw[code] = Math.min(...values);
    } else {
      idealPositiveRaw[code] = Math.min(...values);
      idealNegativeRaw[code] = Math.max(...values);
    }
  });

  const distancesRaw = weightedRaw.map((row) => {
    const dPlus = Math.sqrt(
      codes.reduce((sum, code) => sum + Math.pow(row.values[code] - idealPositiveRaw[code], 2), 0)
    );
    const dMinus = Math.sqrt(
      codes.reduce((sum, code) => sum + Math.pow(row.values[code] - idealNegativeRaw[code], 2), 0)
    );
    return { ...row, dPlus, dMinus };
  });

  const results: TopsisResult[] = distancesRaw
    .map((row) => {
      const denominator = row.dPlus + row.dMinus;
      const preference = denominator === 0 ? 0.5 : row.dMinus / denominator;

      return {
        id: row.id,
        code: row.code,
        nama: row.nama,
        nik: row.nik,
        alamat: row.alamat,
        preference: round(preference, 4),
        dPlus: round(row.dPlus),
        dMinus: round(row.dMinus),
        scores: row.scores,
        rank: 0,
      };
    })
    .sort((a, b) => b.preference - a.preference)
    .map((row, index) => ({
      ...row,
      rank: index + 1,
    }));

  return {
    assessed,
    weightSum: round(weightSum),
    normalizedWeights: roundRecord(normalizedWeights),
    decisionMatrix: decisionMatrix.map((row) => ({ ...row, values: roundRecord(row.values) })),
    divisor: roundRecord(divisor),
    normalized: normalizedRaw.map((row) => ({ ...row, values: roundRecord(row.values) })),
    weighted: weightedRaw.map((row) => ({ ...row, values: roundRecord(row.values) })),
    idealPositive: roundRecord(idealPositiveRaw),
    idealNegative: roundRecord(idealNegativeRaw),
    distances: distancesRaw.map((row) => ({
      ...row,
      dPlus: round(row.dPlus),
      dMinus: round(row.dMinus),
      values: roundRecord(row.values),
    })),
    results,
  };
}
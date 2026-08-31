// Official Canadian TFSA annual contribution limits from 2009 onward.
// Source: Canada Revenue Agency (canada.ca) — confirmed 2026 limit = $7,000.
export const TFSA_LIMITS = {
  2009: 5000,
  2010: 5000,
  2011: 5000,
  2012: 5000,
  2013: 5500,
  2014: 5500,
  2015: 10000,
  2016: 5500,
  2017: 5500,
  2018: 5500,
  2019: 6000,
  2020: 6000,
  2021: 6000,
  2022: 6000,
  2023: 6500,
  2024: 7000,
  2025: 7000,
  2026: 7000,
};

export const LIMIT_YEARS = Object.keys(TFSA_LIMITS).map(Number).sort((a, b) => a - b);
export const CURRENT_YEAR = 2026;

/**
 * Estimate a user's cumulative TFSA contribution room.
 * @param {number} birthYear  - year the user was born
 * @param {number} contributions - total amount already contributed (lifetime, never withdrawn)
 * @param {number} withdrawals - total amount previously withdrawn (added back the following year)
 * @returns {{ totalRoom:number, eligibleRoom:number, unusedRoom:number, maxPossible:number, startYear:number }}
 */
export function estimateRoom({ birthYear, contributions, withdrawals }) {
  const turned18Year = birthYear + 18;
  // TFSA room accumulates from the year you turn 18 (if 2009 or later).
  const startYear = Math.max(turned18Year, 2009);

  let maxPossible = 0;
  for (let y = startYear; y <= CURRENT_YEAR; y++) {
    if (TFSA_LIMITS[y] !== undefined) {
      maxPossible += TFSA_LIMITS[y];
    }
  }

  // Room = max possible - contributions made + withdrawals re-added.
  // Withdrawals get added back to contribution room on Jan 1 of the following year.
  const unusedRoom = Math.max(0, maxPossible - contributions + withdrawals);
  const eligibleRoom = maxPossible + withdrawals;

  return {
    totalRoom: maxPossible,
    eligibleRoom,
    unusedRoom,
    maxPossible,
    startYear,
  };
}

/**
 * Build a year-by-year growth comparison between a TFSA and a non-registered account.
 * Assumptions:
 *  - Monthly contributions compounded monthly.
 *  - TFSA: no tax on growth.
 *  - Non-registered: investment income taxed annually at the effective rate on the
 *    year's growth (simplified accrual model). Capital gains are normally taxed on
 *    realization; this estimate applies the annual tax drag to each year's growth for
 *    an illustrative comparison — results are approximations, not advice.
 *
 * @returns {{ series: Array, tfsaFinal:number, nonRegFinal:number, totalContrib:number, taxSavings:number }}
 */
export function projectGrowth({
  startingBalance,
  monthlyContribution,
  annualReturn, // percent, e.g. 6
  years,
  taxRate, // percent, e.g. 30
}) {
  const r = annualReturn / 100;
  const monthlyRate = r / 12;
  const tax = taxRate / 100;
  const series = [];

  let tfsaBalance = startingBalance;
  let nonRegBalance = startingBalance;
  let nonRegCost = startingBalance; // total after-tax cost base (contributions, for reference)
  let totalContrib = startingBalance;

  // year 0
  series.push({
    year: 0,
    tfsa: round(tfsaBalance),
    nonReg: round(nonRegBalance),
    contributions: round(totalContrib),
  });

  for (let y = 1; y <= years; y++) {
    // TFSA grows tax-free.
    tfsaBalance = growMonthly(tfsaBalance, monthlyContribution, monthlyRate);

    // Non-registered: grow, then apply tax drag on the year's growth.
    const preGrowth = nonRegBalance;
    nonRegBalance = growMonthly(nonRegBalance, monthlyContribution, monthlyRate);
    const yearGrowth = nonRegBalance - preGrowth - monthlyContribution * 12;
    if (yearGrowth > 0) {
      nonRegBalance -= yearGrowth * tax;
    }

    totalContrib += monthlyContribution * 12;

    series.push({
      year: y,
      tfsa: round(tfsaBalance),
      nonReg: round(nonRegBalance),
      contributions: round(totalContrib),
    });
  }

  const tfsaFinal = tfsaBalance;
  const nonRegFinal = nonRegBalance;
  const taxSavings = tfsaFinal - nonRegFinal;

  return {
    series,
    tfsaFinal: round(tfsaFinal),
    nonRegFinal: round(nonRegFinal),
    totalContrib: round(totalContrib),
    taxSavings: round(taxSavings),
  };
}

function growMonthly(balance, monthlyContribution, monthlyRate) {
  let b = balance;
  for (let m = 0; m < 12; m++) {
    b = b * (1 + monthlyRate) + monthlyContribution;
  }
  return b;
}

function round(n) {
  return Math.round(n * 100) / 100;
}

export function formatCurrency(n) {
  if (!isFinite(n)) return "$0";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

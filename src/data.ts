import { format, add } from "date-fns";

export interface Datum {
  x: string;
  y: number;
}

export let years = 30;
export const fundData: Datum[] = [];
export const goalData: Datum[] = [];

let startDate = new Date(2020, 0, 1);
let startFund = 100000;
let incrFund = 1000;
let annualYield = 10 / 100;

let annualInflation = 2.5 / 100;
let goal = 1000000;

for (
  let i = 0, lastDate = startDate, lastFund = startFund;
  i < years * 12;
  i++
) {
  fundData.push({
    x: format(lastDate, "yyyy-MM-dd"),
    y: lastFund
  });

  goalData.push({
    x: format(lastDate, "yyyy-MM-dd"),
    y: goal * Math.pow(1 + annualInflation, i / 12)
  });

  lastDate = add(lastDate, { months: 1 });
  lastFund = lastFund * (1 + annualYield / 12) + incrFund;
}

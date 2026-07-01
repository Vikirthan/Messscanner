const MEAL_PRICE = 22; // Rs per meal
const MEALS_STORAGE_KEY = 'mess_meals';

export interface MealRecord {
  id: string;
  workerId: string;
  date: string; // ISO date string
  timestamp: number; // Unix timestamp
  amount: number; // Always 22 Rs
}

export const addMeal = (workerId: string): MealRecord => {
  const meals = getMeals();
  const newMeal: MealRecord = {
    id: `meal_${Date.now()}_${Math.random()}`,
    workerId,
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    amount: MEAL_PRICE,
  };
  
  meals.push(newMeal);
  localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(meals));
  return newMeal;
};

export const getMeals = (): MealRecord[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(MEALS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getMealsByWorker = (workerId: string): MealRecord[] => {
  return getMeals().filter(meal => meal.workerId === workerId);
};

export const getMealsByMonth = (year: number, month: number): Record<string, MealRecord[]> => {
  const meals = getMeals();
  const filtered = meals.filter(meal => {
    const date = new Date(meal.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const grouped: Record<string, MealRecord[]> = {};
  filtered.forEach(meal => {
    if (!grouped[meal.workerId]) {
      grouped[meal.workerId] = [];
    }
    grouped[meal.workerId].push(meal);
  });

  return grouped;
};

export const getMealCountByWorker = (year: number, month: number): Record<string, number> => {
  const grouped = getMealsByMonth(year, month);
  const counts: Record<string, number> = {};

  Object.keys(grouped).forEach(workerId => {
    counts[workerId] = grouped[workerId].length;
  });

  return counts;
};

export const calculateSalaryDeduction = (mealCount: number): number => {
  return mealCount * MEAL_PRICE;
};

export const clearAllMeals = (): void => {
  localStorage.removeItem(MEALS_STORAGE_KEY);
};

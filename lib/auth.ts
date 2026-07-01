// Mock worker data - in production, this would come from a backend
const WORKERS = [
  { id: 'W001', name: 'Raj Kumar', password: 'password123', department: 'Sales' },
  { id: 'W002', name: 'Priya Singh', password: 'password123', department: 'HR' },
  { id: 'W003', name: 'Arun Patel', password: 'password123', department: 'IT' },
  { id: 'W004', name: 'Neha Sharma', password: 'password123', department: 'Finance' },
  { id: 'W005', name: 'Vikram Gupta', password: 'password123', department: 'Operations' },
];

export interface Worker {
  id: string;
  name: string;
  department: string;
}

export const validateLogin = (workerId: string, password: string): Worker | null => {
  const worker = WORKERS.find(w => w.id === workerId && w.password === password);
  return worker ? { id: worker.id, name: worker.name, department: worker.department } : null;
};

export const getWorker = (workerId: string): Worker | null => {
  const worker = WORKERS.find(w => w.id === workerId);
  return worker ? { id: worker.id, name: worker.name, department: worker.department } : null;
};

export const getAllWorkers = (): Worker[] => {
  return WORKERS.map(w => ({ id: w.id, name: w.name, department: w.department }));
};

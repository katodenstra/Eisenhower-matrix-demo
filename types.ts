
export enum QuadrantType {
  DO_NOW = 'DO_NOW',
  DO_LATER = 'DO_LATER',
  DELEGATE = 'DELEGATE',
  ELIMINATE = 'ELIMINATE'
}

export interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  labels: string[];
  completed: boolean;
  quadrant: QuadrantType;
  createdAt: number;
}

export interface QuadrantConfig {
  type: QuadrantType;
  label: string;
  sublabel: string;
  bg: string;
  border: string;
  accent: string;
}

export interface AISuggestion {
  type: 'BLOAT' | 'GROUP' | 'TAG' | 'URGENT';
  message: string;
  taskId?: string;
  targetQuadrant?: QuadrantType;
}

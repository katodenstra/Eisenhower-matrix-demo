
import { QuadrantType, QuadrantConfig } from './types';

export const QUADRANTS: Record<QuadrantType, QuadrantConfig> = {
  [QuadrantType.DO_NOW]: {
    type: QuadrantType.DO_NOW,
    label: 'Do Now',
    sublabel: 'Urgent & Important',
    bg: 'bg-[#f0fdf4]',
    border: 'border-[#166534]',
    accent: '#166534'
  },
  [QuadrantType.DO_LATER]: {
    type: QuadrantType.DO_LATER,
    label: 'Do Later',
    sublabel: 'Urgent & Not Important',
    bg: 'bg-[#eff6ff]',
    border: 'border-[#1e40af]',
    accent: '#1e40af'
  },
  [QuadrantType.DELEGATE]: {
    type: QuadrantType.DELEGATE,
    label: 'Delegate',
    sublabel: 'Important & Not Urgent',
    bg: 'bg-[#fffbeb]',
    border: 'border-[#854d0e]',
    accent: '#854d0e'
  },
  [QuadrantType.ELIMINATE]: {
    type: QuadrantType.ELIMINATE,
    label: 'Eliminate',
    sublabel: 'Not Urgent & Not Important',
    bg: 'bg-[#fef2f2]',
    border: 'border-[#991b1b]',
    accent: '#991b1b'
  }
};

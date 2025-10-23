import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * classname utility function
 * Tailwind CSSクラスを結合し、競合を解決する
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

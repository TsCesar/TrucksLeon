import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  return phone.replace(/\s/g, '').replace(/(\+34)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
}

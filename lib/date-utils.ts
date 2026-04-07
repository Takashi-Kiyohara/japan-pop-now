import { format } from 'date-fns';

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM yyyy');
  } catch {
    return dateString;
  }
}

export function formatDateFull(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  } catch {
    return dateString;
  }
}

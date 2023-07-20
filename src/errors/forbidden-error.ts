import { ApplicationError } from '@/protocols';

export function ForbiddenError(): ApplicationError {
  return {
    name: 'ForbiddenError',
    message: 'This action is not pemited',
  };
}
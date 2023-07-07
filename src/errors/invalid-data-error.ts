import { ApplicationError } from '@/protocols';

export function invalidDataError(details: string | string[]): ApplicationInvalidateDataError {
  return {
    name: 'InvalidDataError',
    message: 'Invalid data',
    details,
  };
}

type ApplicationInvalidateDataError = ApplicationError & {
  details: string | string[];
};

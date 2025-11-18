export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
}

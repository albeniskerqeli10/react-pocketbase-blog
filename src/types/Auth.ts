import { Record, Admin } from 'pocketbase';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  verified?: boolean;
}

export type LoginFormValues = {
  email: string;
  password: string;
};

export type SignUpFormValues = LoginFormValues & {
  username: string;
};

export type ExtendedUser = User | Record | Admin;

export type ErrorResponse = {
  status: number;
  data?: {
    message: string;
  };
  message?: string;
};

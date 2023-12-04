import { RecordModel, AdminModel } from 'pocketbase';
import { BlogType } from './Blog';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  verified?: boolean;
  created?: Date;
  expand?: {
    blogs: BlogType[];
  };
}

export type LoginFormValues = {
  email: string;
  password: string;
};

export type SignUpFormValues = LoginFormValues & {
  username: string;
};

export type ExtendedUser = User | RecordModel | AdminModel;

export type ErrorResponse = {
  status: number;
  data?: {
    message: string;
  };
  message?: string;
};

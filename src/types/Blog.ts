import { Record } from 'pocketbase';
import { ReactNode } from 'react';
export type BlogType = Partial<Record> & {
  id: string;
  title: string;
  content?: string;
  image: string;
  expand?: {
    user: {
      id: string;
      username: string;
      avatar?: string;
      created: ReactNode;
    };
  };
};

export type BlogFormValues = {
  title: string;
  content: string;
  image: string;
};

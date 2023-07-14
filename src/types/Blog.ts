import { Record } from 'pocketbase';
import { ReactNode } from 'react';
export type BlogType = Partial<Record> & {
  id: string;
  title: string;
  content?: string;
  image: string;
  likes: Array<string>;
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

export type BlogActionsProps = {
  blog: BlogType;
  // eslint-disable-next-line no-unused-vars
  onUpdate: (newBlog: BlogType) => void;
};

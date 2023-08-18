import { Record } from 'pocketbase';
import { ReactNode } from 'react';
import { ExtendedUser } from './Auth';
export type BlogType = Partial<Record> & {
  id: string;
  title: string;
  content?: string;
  image: string;
  likes: Array<string>;
  shouldLoad?: 'lazy' | 'eager';
  shouldPreload?: 'auto' | 'high' | 'low';
  width?: string;
  user?: string;
  showAuthorInfo?: boolean;
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

export type BlogCommentType = {
  id: number;
  text: string;
  created: string | number | Date;
  expand?: {
    user: ExtendedUser;
  };
};

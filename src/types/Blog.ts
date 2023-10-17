import { RecordModel } from 'pocketbase';
import { ReactNode } from 'react';
import { ExtendedUser } from './Auth';
export type BlogType = Partial<RecordModel> & {
  id?: string;
  title: string;
  content: string;
  image: string;
  likes: Array<string>;
  shouldLoad?: 'lazy' | 'eager';
  shouldPreload?: 'auto' | 'high' | 'low';
  shouldDecode?: 'sync' | 'async';
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

export type ActionForm = {
  // eslint-disable-next-line no-unused-vars
  get(name: FormDataEntryValue): FormDataEntryValue;
};

export type BlogFormValues = {
  title: string;
  content: string;
  image: string;
};

export type BlogActionsProps = {
  blog: BlogType;
  // eslint-disable-next-line no-unused-vars
  // onUpdate: (newBlog: BlogType) => void;
};

export type BlogCommentType = {
  id: string;
  text: string;
  created: string | number | Date;
  likes: Array<string>;
  expand?: {
    user: ExtendedUser;
  };
  user: ExtendedUser;
};

export type EditBlogType = {
  blog: BlogType;
  values: BlogFormValues;
};

export type LikeBlogType = {
  blog: BlogType;
  userID: string | number;
};

export type LikeCommentType = {
  comment: BlogCommentType;
  userID: string | number;
};

export type Tag = Partial<RecordModel> & {
  id: number;
  name: string;
};

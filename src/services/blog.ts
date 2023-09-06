import { cache } from 'react';
import { pb } from '../lib/pocketbase';
import { BlogType } from '../types/Blog';
import { redirect } from 'react-router-dom';
import { ErrorResponse } from '../types/Auth';

type BlogsType = {
  items: BlogType[];
};

export const getBlogs = cache(async (sortField: string) => {
  const blogs: BlogsType = await pb.collection('blogs').getList(0, 20, {
    sort: sortField,
    expand: 'user',
  });
  return blogs.items;
});

export const getSingleBlog = cache(async (id: string) => {
  try {
    const blog: BlogType = await pb.collection('blogs').getOne(id as string, {
      expand: 'user, comments(blog).user',
    });
    return blog;
  } catch (err: unknown) {
    const errorResponse = err as ErrorResponse;
    if (errorResponse.status === 404) {
      return redirect('/');
      /**/
    }
  }
});

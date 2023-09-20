import { cache } from 'react';
import { pb } from '../lib/pocketbase';
import { BlogType, EditBlogType, LikeBlogType } from '../types/Blog';
import { redirect } from 'react-router-dom';
import { ErrorResponse } from '../types/Auth';

type BlogsType = {
  items: BlogType[];
};

// GET requests
export const getBlogs = cache(async (sortField: string) => {
  const blogs: BlogsType = await pb.collection('blogs').getList(0, 20, {
    sort: sortField,
    expand: 'user',
  });
  return blogs.items;
});

export const getAllBlogs = cache(async (sortField: string) => {
  const blogs: BlogsType['items'] = await pb.collection('blogs').getFullList({
    sort: sortField,
    expand: 'user',
  });
  return blogs;
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

// POST requests
export const addBlog = async (blogData: BlogType) => {
  const blog = await pb.collection('blogs').create(blogData, {
    expand: 'user',
  });

  return blog;
};

// PUT requests
export const editBlog = async ({ blog, values }: EditBlogType) => {
  const editedBlog = pb.collection('blogs').update(
    blog.id as string,
    {
      title: values.title !== '' ? values.title : blog.title,
      content: values.content !== '' ? values.content : blog.content,
      image: values.image !== '' ? values.image : blog.image,
    },
    {
      expand: 'user',
    },
  );
  return editedBlog;
};

export const likeBlog = async ({ blog, userID }: LikeBlogType) => {
  if (!blog.id || !userID) {
    return console.error('Blog is undefined.');
  }
  const existingBlogLikes: Array<string> = blog.likes;
  return await pb.collection('blogs').update(blog.id, {
    likes: [...existingBlogLikes, userID],
    user: blog.user,
  });
};

export const unlikeBlog = async ({ blog, userID }: LikeBlogType) => {
  if (!blog.id) {
    return console.error('Blog is undefined.');
  }
  const existingBlogLikes: Array<string> = blog.likes;

  const newLikes = existingBlogLikes.filter((likeId: string) => likeId !== userID);

  await pb.collection('blogs').update(blog.id, {
    likes: newLikes,
    user: blog.user,
  });
};
// DELETE requests
export const deleteBlog = async (id: string) => {
  return await pb.collection('blogs').delete(id as string);
};

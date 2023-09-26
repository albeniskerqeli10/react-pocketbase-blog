import { cache } from 'react';
import { pb } from '../lib/pocketbase';
import { BlogType, EditBlogType, LikeBlogType, LikeCommentType } from '../types/Blog';
import { redirect } from 'react-router-dom';
import { ErrorResponse } from '../types/Auth';

type BlogsType = {
  items: BlogType[];
};

// GET requests
export const getBlogs = cache(async (sortField: string) => {
  try {
    const blogs: BlogsType = await pb.collection('blogs').getList(0, 20, {
      sort: sortField,
      expand: 'user',
    });
    return blogs.items;
  } catch (err: unknown) {
    console.error('Something went wrong' + err);
  }
});

export const searchBlogs = cache(async (query: string) => {
  try {
    const blogs: BlogsType['items'] = await pb.collection('blogs').getFullList({
      filter: `title~"${query}"`,
      expand: 'user',
    });
    return blogs;
  } catch (err: unknown) {
    console.error('Something went wrong' + err);
  }
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

export const getBlogTags = cache(async () => {
  const tags = await pb.collection('tags').getFullList();
  return tags;
});

// POST requests
export const addBlog = async (blogData: BlogType) => {
  try {
    const blog = await pb.collection('blogs').create(blogData, {
      expand: 'user',
    });

    return blog;
  } catch (err: unknown) {
    console.error('Something went wrong' + err);
  }
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
  if (!blog.id) {
    return console.error('Blog is undefined.');
  }
  const existingBlogLikes: Array<string> = blog.likes;
  return await pb.collection('blogs').update(blog.id, {
    likes: [...existingBlogLikes, userID],
    user: userID,
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

export const likeComment = async ({ comment, userID }: LikeCommentType) => {
  if (!comment.id || !userID) {
    return console.error('Comment is undefined.');
  }
  const existingCommentLikes: Array<string> = comment.likes;
  return await pb.collection('comments').update(comment.id, {
    likes: [...existingCommentLikes, userID],
    user: comment.user,
  });
};

export const unlikeComment = async ({ comment, userID }: LikeCommentType) => {
  if (!comment.id) {
    return console.error('Comment is undefined.');
  }
  const existingCommentLikes: Array<string> = comment.likes;

  const newLikes = existingCommentLikes.filter((likeId: string) => likeId !== userID);

  return await pb.collection('comments').update(comment.id, {
    likes: newLikes,
    user: comment.user,
  });
};

// DELETE requests
export const deleteBlog = async (id: string) => {
  if (!id) {
    return console.error('Blog ID is undefined');
  } else {
    return await pb.collection('blogs').delete(id as string);
  }
};

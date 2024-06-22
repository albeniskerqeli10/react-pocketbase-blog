import { cache } from 'react';
import { pb } from '../lib/pocketbase';
import { BlogType, BlogsType, EditBlogType, LikeBlogType, LikeCommentType, Tag } from '../types/Blog';
import { ExtendedUser } from '../types/Auth';

// GET requests
// export const getBlogs = cache(async (sortField: string) => {
//   try {
//     const res: any = await fetch(
//       'https://react-pocketbase-microblog.pockethost.io/api/collections/blogs/records?page=0&perPage=30&sort=-created&expand=user&fields=id%2Ctitle%2Cimage%2Cexpand.user.avatar%2C%20expand.user.username%2C%20user%20',
//     );
//     const data = await res.json();
//     // console.log(
//     //   'https://react-pocketbase-microblog.pockethost.io/api/collections/blogs/records?page=0&perPage=30&sort=-created&expand=user&fields=id%2Ctitle%2Cimage%2Cexpand.user.avatar%2C%20expand.user.username%2C%20user%20',
//     // );
//     console.log(data, 'data');
//     return data.items;
//   } catch (err: unknown) {
//     throw new Error('Something went wrong' + err);
//   }
// });
export const appCache = new Map();

export const refreshCache = ({ key, data }: { key: string; data: any }) => {
  console.log('do', appCache);
  appCache.set(key, data);
};
// console.log(appCache.get('blogs'), 'asdlasldlasdl');
export const getBlogs = cache(async (sortField: string) => {
  try {
    // if (appCache.has('blogs')) {
    //   return appCache.get('blogs');
    // }

    const blogs: BlogsType = await pb.collection('blogs').getList(0, 30, {
      sort: sortField,
      expand: 'user',
      fields: 'id,title,image,expand.user.avatar, expand.user.username, user ',
    });
    // appCache.set('blogs', blogs.items);
    // console.log(appCache.get('blogs'), 'asdlasldlasdl');

    return blogs.items;
  } catch (err: unknown) {
    console.error('Something went wrong' + err);
  }
});

// export const getSynkBlogs = cache(async () => {
//   try {
//     const blogs: BlogsType = await pb.collection('blogs').getList(0, 30, {
//       sort: '-likes',
//       expand: 'user',
//       fields: 'id,title,image,expand.user.avatar, expand.user.username, user ',
//     });
//     return blogs.items;
//   } catch (err: unknown) {
//     console.error('Something went wrong' + err);
//   }
// });

// export const getTodo = cache(async (id: number) => {
//   const todo = await fetch(`https://dummyjson.com/todos/${id}`);
//   return todo.json();
// });

export const searchBlogs = cache(async (query: string) => {
  try {
    const blogs = await pb.collection('blogs').getFullList({
      filter: `title~"${query}"`,
      expand: 'user',
    });
    return blogs;
  } catch (err: unknown) {
    console.error('Something went wrong' + err);
  }
});
export const searchUsers = cache(async (query: string) => {
  try {
    const users: ExtendedUser[] = await pb.collection('users').getFullList({
      filter: `username~"${query}"`,
    });
    return users;
  } catch (err: unknown) {
    console.error('Something went wrong' + err);
  }
});

export const getSingleBlog = cache(async (id: string) => {
  try {
    // if (appCache.has(id)) {
    //   return appCache.get(id);
    // }
    const blog: BlogType = await pb.collection('blogs').getOne(id as string, {
      expand: 'user, comments(blog).user, tags',
    });
    // appCache.set(id, blog);
    return blog;
  } catch (err: unknown) {
    console.error('Blog not found');
  }
});

// const getCommentsById = async (id: string) => {
//   const comments = await pb.collection('comments').getFullList({
//     filter: `blog~"${id}"`,
//   });
//   return comments;
// };

export const getBlogTags = cache(async (query: string) => {
  try {
    const tags: Tag[] = await pb.collection('tags').getFullList({
      filter: `name~"${query}"`,
    });
    return tags;
  } catch (err: unknown) {
    console.error('Something went wrong' + err);
  }
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

// PATCH/UPDATE requests
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

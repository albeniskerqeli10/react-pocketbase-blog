import { pb } from '../lib/pocketbase';
// import { cache } from 'react';
const cacheio = new Map();

// GET Requests

export const getUserProfile = async (id: string) => {
  if (cacheio.has(id)) {
    return cacheio.get(id);
  }
  try {
    const user = await pb.collection('users').getOne(id as string, {
      expand: 'blogs(user)',
    });
    cacheio.set('profile', id);
    return user;
  } catch (err) {
    return console.error('Something went wrong' + err);
  }
};

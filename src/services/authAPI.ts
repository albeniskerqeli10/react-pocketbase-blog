import { pb } from '../lib/pocketbase';
import { cache } from 'react';
// GET Requests
export const getUserProfile = cache(async (id: string) => {
  try {
    const user = await pb.collection('users').getOne(id as string, {
      expand: 'blogs(user)',
    });
    return user;
  } catch (err) {
    return console.error('Something went wrong' + err);
  }
});

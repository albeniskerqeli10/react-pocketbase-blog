import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '../services/authAPI';
import { ExtendedUser } from '../types/Auth';

type SingleUserQuery = {
  data: ExtendedUser;
  isError: boolean;
};

const useSingleUser = (id: string) => {
  const { data: user, isError }: SingleUserQuery = useSuspenseQuery({
    queryKey: ['user', id],
    queryFn: () => getUserProfile(id),
  });

  return { user, isError };
};

export default useSingleUser;

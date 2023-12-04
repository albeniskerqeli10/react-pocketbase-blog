import { Image, AvatarProps } from '@chakra-ui/react';

type UserAvatarType = {
  src: string;
  width?: string;
  height?: string;
  loading?: 'eager' | 'lazy';
  fetchpriority?: 'low' | 'high' | 'auto';
} & AvatarProps;

const UserAvatar = ({
  src,
  width = '30px',
  height = '30px',
  loading = 'eager',
  fetchpriority = 'auto',
  ...avatarProps
}: UserAvatarType) => {
  return (
    <Image
      src={src}
      alt='user avatar'
      width={width}
      height={height}
      loading={loading}
      fetchpriority={fetchpriority}
      onError={(e) => {
        const img = e.target as HTMLImageElement;

        img.src = 'https://placehold.co/600x400/000/FFF/webp?text=Image&font=roboto';
      }}
      decoding='async'
      rounded='3xl'
      {...avatarProps}
    />
  );
};

export default UserAvatar;

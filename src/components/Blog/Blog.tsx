import { LinkBox, Image, LinkOverlay, Heading, Box, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BlogType } from '../../types/Blog';
import { FC, memo } from 'react';
import { AppState, useStore } from '../../lib/store';
const Blog: FC<BlogType> = ({
  id,
  title,
  user,
  image,
  avatar,
  shouldLazyLoad,
  width = '100%',
  priority,
  shouldPreload,
  username,
  shouldDecode,
}) => {
  const currentUser = useStore((state: AppState) => state.user);

  return (
    <LinkBox
      className='blog'
      key={id}
      as='article'
      rounded='sm'
      width='100%'
      boxShadow='md'
      maxWidth={width}
      pb='10px'
      bgColor='#0c0c0e'
      display='flex'
      gap='5px'
      alignItems='start'
      flexDirection='column'
      justifyContent='center'
      aria-label='Blog post'
      flexWrap='wrap'
    >
      <Box bgColor='inherit' width='100%' display='flex' flexDirection='column'>
        <LinkOverlay as={Link} to={`/blog/${id}`}>
          <Image
            decoding={shouldDecode}
            width='100%'
            objectFit='cover'
            fetchpriority={priority}
            loading={shouldLazyLoad}
            htmlWidth='600'
            htmlHeight='300'
            objectPosition='center'
            onError={(e) => {
              const img = e.target as HTMLImageElement;

              img.src = 'https://placehold.co/600x400/000/FFF/webp?text=Image&font=roboto';
            }}
            height='300px'
            src={image}
            maxWidth='100%'
            alt='blog image'
          />
        </LinkOverlay>
        <Box
          px='10px'
          width='100%'
          display='flex'
          bgColor='inherit'
          alignItems='center'
          justifyContent='start'
          flexWrap='wrap'
          gap='10px'
          py='10px'
          flexDirection='row'
        >
          <Image
            fetchpriority={shouldPreload}
            loading={shouldLazyLoad}
            src={avatar}
            alt=' author avatar'
            width='30px'
            decoding='async'
            rounded='3xl'
            height='30px'
          />
          <Text
            as={Link}
            to={currentUser?.id === user ? '/profile' : `../../user/${user}`}
            relative='path'
            _hover={{
              textDecoration: 'underline',
            }}
            color='white'
            bgColor='transparent'
          >
            {username}
          </Text>
        </Box>

        <Heading fontSize='xl' px='10px' py='5px' bgColor='inherit' color='white'>
          {title}
        </Heading>
        <Box
          color='white'
          bgColor='transparent'
          width='100%'
          display='flex'
          px='10px'
          alignItems='center'
          justifyContent='start'
          gap='10px'
          flexDirection='row'
        ></Box>
      </Box>
    </LinkBox>
  );
};

export default memo(Blog);

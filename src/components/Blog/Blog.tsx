import { LinkBox, Image, LinkOverlay, Heading, Box, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BlogType } from '../../types/Blog';
import { FC, memo } from 'react';
import { AppState, useStore } from '../../lib/store';
const Blog: FC<BlogType> = ({ id, title, user, image, avatar, width = '100%', username }) => {
  const currentUser = useStore((state: AppState) => state.user);

  return (
    <LinkBox
      className='blog'
      key={id}
      as='article'
      rounded='sm'
      width='100%'
      boxShadow='lg'
      maxWidth={width}
      pb='10px'
      bgColor='#060608'
      display='flex'
      gap='5px'
      alignItems='start'
      flexDirection='column'
      justifyContent='center'
      aria-label='Blog post'
      flexWrap='wrap'
    >
      <Box width='100%' display='flex' flexDirection='column'>
        <LinkOverlay as={Link} to={`/blog/${id}`}>
          <Box>
            <Image
              src={image}
              alt='blog image'
              width='100%'
              height='auto'
              objectFit='cover'
              objectPosition='center'
              htmlWidth='600'
              maxHeight='330px'
              border='1px solid #232323'
              decoding='async'
              loading='lazy'
              onError={(e) => {
                const img = e.target as HTMLImageElement;

                img.src = 'https://placehold.co/600x400/000/FFF/webp?text=Image&font=roboto';
              }}
            />
          </Box>
        </LinkOverlay>
        <Box
          px='10px'
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='start'
          flexWrap='wrap'
          gap='10px'
          py='10px'
          flexDirection='row'
        >
          <Image
            loading='lazy'
            src={avatar}
            alt=' author avatar'
            width='25px'
            decoding='async'
            rounded='3xl'
            height='25px'
          />
          <Text
            as={Link}
            to={currentUser?.id === user ? '/profile' : `../../user/${user}`}
            relative='path'
            _hover={{
              textDecoration: 'underline',
            }}
            color='white'
          >
            {username}
          </Text>
        </Box>

        <Heading fontSize='xl' px='10px' py='5px' pb='7px' color='white'>
          {title}
        </Heading>
        <Box
          color='white'
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

import { LinkBox, Image, LinkOverlay, Heading, Box, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BlogType } from '../../types/Blog';
import { FC } from 'react';
const Blog: FC<BlogType> = ({ id, title, image, avatar, username }) => {
  return (
    <LinkBox
      className='blog'
      key={id}
      as='article'
      width='600px'
      boxShadow='lg'
      pb='10px'
      bgColor='black'
      display='flex'
      gap='5px'
      alignItems='start'
      flexDirection='column'
      justifyContent='center'
      flexWrap='wrap'
    >
      <LinkOverlay as={Link} width='100%' display='flex' flexDirection='column' to={`/blog/${id}`}>
        <Image
          decoding='async'
          width='100%'
          objectFit='cover'
          fetchpriority='auto'
          loading='lazy'
          htmlWidth='600'
          htmlHeight='300'
          objectPosition='center'
          height='300px'
          src={image}
          alt='blog image'
        />
        <Box
          px='10px'
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='start'
          bgColor='transparent'
          flexWrap='wrap'
          gap='10px'
          py='10px'
          flexDirection='row'
        >
          <Image src={avatar} alt=' author avatar' width='30px' rounded='3xl' height='30px' />
          <Text as={Link} to={`/user/${id}`} color='white' bgColor='transparent'>
            {username}
          </Text>
        </Box>
        <Heading fontSize='xl' px='10px' py='5px' bgColor='transparent' color='white'>
          {title}
        </Heading>
      </LinkOverlay>
    </LinkBox>
  );
};

export default Blog;

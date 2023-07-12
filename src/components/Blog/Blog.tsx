import { LinkBox, Image, LinkOverlay, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BlogType } from '../../types/Blog';
import { FC } from 'react';
const Blog: FC<BlogType> = ({ id, title, image }) => {
  return (
    <LinkBox
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
          loading='lazy'
          htmlWidth='600'
          htmlHeight='300'
          objectPosition='center'
          height='300px'
          src={image}
          alt='blog image'
        />
        <Heading fontSize='xl' px='10px' py='10px' bgColor='transparent' color='white'>
          {title}
        </Heading>
      </LinkOverlay>
    </LinkBox>
  );
};

export default Blog;

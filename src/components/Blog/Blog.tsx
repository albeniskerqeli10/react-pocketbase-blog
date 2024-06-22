import { LinkBox, Image as ChakraImage, LinkOverlay, Heading, Box, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { BlogType } from '../../types/Blog';
import { FC, memo } from 'react';
import { AppState, useStore } from '../../lib/store';
// import { prefetchDNS, preload, preloadModule } from 'react-dom';
// import { preloadModule } from 'react-dom';
const Blog: FC<BlogType> = ({ id, title, user, image, avatar, width = '100%', username, ...rest }) => {
  const currentUser = useStore((state: AppState) => state.user);

  // const prefetchImg = () => {
  //   let img = new Image();
  //   img.src = image;
  //   console.log(img, 'prefetched');
  // };

  return (
    <>
      <LinkBox
        {...rest}
        className='blog'
        border='1px solid #18181b'
        key={id}
        // onTouchStart={() => {
        //   // const prefetchLinks = document.querySelectorAll('[rel="prefetch"]');
        //   const prefetchLink = document.createElement('link');
        //   prefetchLink.rel = 'prefetch';
        //   prefetchLink.href = `${
        //     import.meta.env.VITE_POCKETBASE_URL
        //   }/api/collections/blogs/records/${id}?expand=user%2C%20comments(blog).user%2C%20tags`;
        //   prefetchLink.crossOrigin = 'anonymous';

        //   // const imgLn = document.createElement('link');
        //   // imgLn.rel = 'preload';
        //   // imgLn.href = image;
        //   // imgLn.as = 'image';
        //   // imgLn.crossOrigin = 'anonymous';
        //   const headTag = document.getElementsByTagName('head')[0].innerHTML;
        //   if (!headTag.includes(prefetchLink.href)) {
        //     document.head.appendChild(prefetchLink);
        //   } else {
        //     // document.head.removeChild(ln);
        //     // document.head.removeChild(imgLn);
        //   }
        // }}
        onMouseEnter={async () => {
          // preload(image, {
          // prefetchImg();
          //   as: 'image',

          // await import('../../routes/SingleBlog/SingleBlog');

          // preloadModule('/src/routes/SingleBlog/SingleBlog.tsx', { as: 'script' });
          // });
          // preloadModule('/dist/assets/SingleBlog-U7MesDn5.js', {
          //   as: 'script',
          // });

          //  const prefetchLinks = document.querySelectorAll('[rel="prefetch"]');
          const dn = document.createElement('link');
          dn.rel = 'modulepreload';
          dn.href = './src/routes/SingleBlog/SingleBlog.tsx';
          document.head.appendChild(dn);

          // const cn = document.createElement('link');
          // cn.rel = 'modulepreload';
          // cn.href = './src/index.css';
          // document.head.appendChild(cn);
          const ln = document.createElement('link');
          ln.rel = 'prefetch';
          ln.href = `https://react-pocketbase-microblog.pockethost.io/api/collections/blogs/records/${id}?expand=user%2C%20comments(blog).user%2C%20tags`;
          ln.crossOrigin = 'anonymous';

          const headTag = document.getElementsByTagName('head')[0].innerHTML;
          if (!headTag.includes(ln.href)) {
            document.head.appendChild(ln);
          }

          // const imgLn = document.createElement('link');
          // imgLn.rel = 'preload';
          // imgLn.href = image;
          // imgLn.as = 'image';
          // imgLn.crossOrigin = 'anonymous';
          // const headTag = document.getElementsByTagName('head')[0].innerHTML;
          // if (!headTag.includes(imgLn.href)) {
          //   document.head.appendChild(imgLn);
          // } else {
          //if (window.location.href.includes(id)) {
          //setTimeout(() => {
          //document.head.removeChild(imgLn);
          //}, 3000);
          //}
          //   // if (window.location.href.includes(id)) {
          //   //   setTimeout(() => {
          //   //     document.head.removeChild(imgLn);
          //   //   }, 3000);
          //   // }
          // }
        }}
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
              <ChakraImage
                src={image}
                alt='blog image'
                width='100%'
                decoding='async'
                height='auto'
                objectFit='cover'
                objectPosition='center'
                htmlWidth='600'
                backgroundColor='black'
                htmlHeight='330'
                maxHeight='330px'
                // border='1px solid #232323'
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
            <ChakraImage loading='lazy' src={avatar} alt=' author avatar' width='25px' rounded='3xl' height='25px' />
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
    </>
  );
};

export default memo(Blog);

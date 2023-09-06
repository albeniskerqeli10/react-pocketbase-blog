import { Box, Heading, Textarea, Spinner, Text } from '@chakra-ui/react';
import { AppState, useStore } from '../../lib/store';

import {
  useMemo,
  Suspense,
  lazy,
  startTransition,
  FC,
  useRef,
  useEffect,
  unstable_useCacheRefresh as useCacheRefresh,
} from 'react';
import { pb } from '../../lib/pocketbase';
import { BlogType, BlogCommentType } from '../../types/Blog';
import SubmitButton from '../UI/SubmitButton/SubmitButton';
const Comment = lazy(() => import('../Comment/Comment'));
const BlogComments: FC<Partial<BlogType>> = ({ blog }) => {
  const user = useStore((state: AppState) => state.user);
  const form = useRef<null>(null);
  const refresh = useCacheRefresh();

  const createCommentAction = async (formData: FormData) => {
    const text = formData.get('text');
    if (text !== '' && user?.id !== null) {
      await pb.collection('comments').create({
        text: text,
        user: user?.id,
        blog: blog.id,
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /* @ts-ignore*/
      form.current.reset();
    }
  };

  const sortedBlogComments: BlogCommentType[] = useMemo(() => {
    return blog?.expand?.['comments(blog)']
      ?.slice()
      ?.sort((a: BlogCommentType, b: BlogCommentType) => Number(new Date(b.created)) - Number(new Date(a.created)));
  }, [blog]);

  useEffect(() => {
    pb.collection('comments').subscribe('*', async function (e) {
      if (e.record.blog === blog.id) {
        startTransition(() => {
          refresh();
        });
      }
    });
    return () => {
      pb.collection('comments').unsubscribe('*');
    };
  }, [blog.id, refresh]);

  return (
    <Box
      className='commentsList'
      width='100%'
      gap='20px'
      display='flex'
      alignItems='flex-start'
      justifyContent='center'
      flexDirection='column'
      bgColor='transparent'
      borderTop='1px solid gray'
      flexWrap='wrap'
      py='10px'
      color='white'
    >
      <Box
        width='100%'
        display='flex'
        alignItems='start'
        justifyContent='center'
        flex='1'
        flexDirection='column'
        flexWrap='wrap'
      >
        <Heading width='100%' color='white' my='10px' fontSize={['lg', 'lg', '30px']} bgColor='transparent'>
          Comments ({sortedBlogComments?.length || 0})
          <Box
            my='20px'
            width='100%'
            display='flex'
            alignItems='center'
            justifyContent='center'
            flexDirection='row'
            flexWrap='wrap'
            gap='20px'
          >
            <Box
              width='100%'
              ref={form}
              as='form'
              action={createCommentAction}
              // onSubmit={handleCreateComment}
              display='flex'
              alignItems='flex-start'
              justifyContent='center'
              px='10px'
              py='20px'
              gap='20px'
              flexDirection='column'
              bgColor='black'
              flexWrap='wrap'
              minHeight='100px'
              border='1px'
              borderColor='#282828	'
              borderStyle='solid'
              boxShadow='lg'
            >
              <Textarea
                resize='none'
                rounded='none'
                name='text'
                placeholder='Write a comment'
                color='white'
                _placeholder={{
                  padding: '0',
                  margin: '0',
                  textAlign: 'left',
                  color: 'white',
                }}
                required
              />
              <SubmitButton size='md' />
            </Box>
            <Suspense fallback={<Spinner colorScheme='white' color='white' />}>
              {sortedBlogComments?.length > 0 ? (
                sortedBlogComments?.map((comment: BlogCommentType) => (
                  <Comment key={comment.id} comment={comment} userId={user?.id} />
                ))
              ) : (
                <Text pt='20px' fontWeight='bold' bgColor='transparent' fontSize='md'>
                  No comments yet. Be the first to share your thoughts!
                </Text>
              )}
            </Suspense>
          </Box>
        </Heading>
      </Box>
    </Box>
  );
};

export default BlogComments;

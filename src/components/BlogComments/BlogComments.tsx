import { Box, Heading, Button, Textarea, Spinner, Text } from '@chakra-ui/react';
import useForm from '../../hooks/useForm';
import { AppState, useStore } from '../../lib/store';
import { useMemo, FormEvent, Suspense, lazy, useState, startTransition, FC, useEffect } from 'react';
import { pb } from '../../lib/pocketbase';
import { BlogType, BlogCommentType } from '../../types/Blog';
const Comment = lazy(() => import('../Comment/Comment'));
const BlogComments: FC<Partial<BlogType>> = ({ blog, onUpdate }) => {
  const user = useStore((state: AppState) => state.user);
  const { values, handleChange, resetForm } = useForm({
    text: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCreateComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.text !== '' && user?.id !== null) {
      setIsSubmitting(true);
      await pb.collection('comments').create({
        text: values.text,
        user: user?.id,
        blog: blog.id,
      });
      startTransition(() => {
        setIsSubmitting(false);
        resetForm();
      });
    }
  };

  const handleDeleteComment = async (id: number) => {
    const confirmMsg = confirm('Do you want to delete this comment?');
    if (confirmMsg) {
      await pb.collection('comments').delete(id.toString());
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
        const updatedBlog: BlogType = await pb.collection('blogs').getOne(blog.id as string, {
          expand: 'user, comments(blog).user',
        });
        startTransition(() => {
          onUpdate(updatedBlog);
        });
      }
    });
    return () => {
      pb.collection('comments').unsubscribe('');
    };
  }, [blog.id, onUpdate]);

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
              as='form'
              onSubmit={handleCreateComment}
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
                value={values.text}
                onChange={handleChange}
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
              {isSubmitting ? (
                <Button
                  type='button'
                  disabled={true}
                  fontWeight='normal'
                  fontSize={['sm', 'md', 'md']}
                  colorScheme='red'
                >
                  <Spinner size='sm' mr={4} color='white' bgColor='transparent' /> Submitting
                </Button>
              ) : (
                <Button
                  outline='0'
                  _focus={{
                    outline: '0px',
                    border: '0',
                  }}
                  type='submit'
                  fontWeight='normal'
                  colorScheme='red'
                  fontSize={['sm', 'md', 'md']}
                >
                  Submit
                </Button>
              )}
            </Box>
            <Suspense fallback={<Spinner colorScheme='white' color='white' />}>
              {sortedBlogComments?.length > 0 ? (
                sortedBlogComments?.map((comment: BlogCommentType) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    userId={user?.id}
                    handleDeleteComment={handleDeleteComment}
                  />
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

import { Box, Heading, Textarea, Button, Spinner } from '@chakra-ui/react';
import useForm from '../../hooks/useForm';
import { useStore } from '../../lib/store';
import { useMemo, FormEvent, Suspense, lazy, useState, startTransition } from 'react';
import { pb } from '../../lib/pocketbase';
import { BlogType, BlogCommentType } from '../../types/Blog';
const Comment = lazy(() => import('../Comment/Comment'));
const BlogComments = ({ blog }: Partial<BlogType>) => {
  const user = useStore((state) => state.user);
  const { values, handleChange, resetForm } = useForm({
    text: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createComment = async (e: FormEvent<HTMLFormElement>) => {
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

  const deleteComment = async (id: number) => {
    await pb.collection('comments').delete(id.toString());
  };

  const sortedBlogComments: BlogCommentType[] = useMemo(() => {
    return blog?.expand?.['comments(blog)']
      ?.slice()
      ?.sort((a: BlogCommentType, b: BlogCommentType) => Number(new Date(b.created)) - Number(new Date(a.created)));
  }, [blog]);

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
        <Heading width='100%' color='white' my='10px' fontSize='30px' bgColor='transparent'>
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
              onSubmit={createComment}
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
                <Button type='button' disabled={true} fontWeight='normal' colorScheme='red'>
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
                >
                  Submit
                </Button>
              )}
            </Box>
            <Suspense fallback={<Spinner />}>
              {sortedBlogComments?.length > 0
                ? sortedBlogComments?.map((comment: BlogCommentType) => (
                    <>
                      <Comment
                        key={comment.id}
                        comment={comment}
                        userId={user?.id}
                        handleDeleteComment={deleteComment}
                      />
                    </>
                  ))
                : null}
            </Suspense>
          </Box>
        </Heading>
      </Box>
    </Box>
  );
};

export default BlogComments;
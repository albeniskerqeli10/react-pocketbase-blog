import { Box, Image, Text, Button } from '@chakra-ui/react';
import { BlogCommentType } from '../../types/Blog';
import { User } from '../../types/Auth';

type CommentProps = {
  comment: BlogCommentType;
  userId?: User['id'];

  // eslint-disable-next-line no-unused-vars
  handleDeleteComment: (id: number) => void;
};

const Comment = ({ comment, userId, handleDeleteComment }: CommentProps) => {
  return (
    <Box
      className='comment'
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      px='10px'
      gap='10px'
      flexDirection='row'
      bgColor='black'
      flexWrap='wrap'
      minHeight='100px'
      rounded='sm'
      border='1px'
      borderColor='#282828	'
      borderStyle='solid'
      boxShadow='lg'
    >
      <Box
        bgColor='transparent'
        gap='10px'
        display='flex'
        alignItems='start'
        justifyContent='center'
        flexDirection='column'
        flexWrap='wrap'
      >
        <Box
          display='flex'
          flexDirection='row'
          bgColor='transparent'
          alignItems='center'
          justifyContent='center'
          gap='10px'
        >
          <Image
            width='30px'
            height='30px'
            objectFit='cover'
            objectPosition='center'
            decoding='async'
            loading='lazy'
            src={comment?.expand?.user?.avatar}
            alt='user avatar'
          />
          <Text bgColor='transparent' fontSize='sm' fontWeight='normal'>
            {comment?.expand?.user?.username}
          </Text>
        </Box>
        <Text bgColor='transparent' fontSize='md' fontWeight='normal'>
          {comment.text}
        </Text>
      </Box>
      {userId === comment?.expand?.user.id && (
        <Button fontWeight='normal' onClick={() => handleDeleteComment(comment.id)} colorScheme='red'>
          Delete
        </Button>
      )}
    </Box>
  );
};

export default Comment;

import { Box, Image, Text, Button, Link, IconButton, Textarea } from '@chakra-ui/react';

import { BlogCommentType } from '../../types/Blog';
import { User } from '../../types/Auth';
import { Link as RouterLink } from 'react-router-dom';
import { pb } from '../../lib/pocketbase';
import { Pencil } from '@phosphor-icons/react';
import { useState } from 'react';
import SubmitButton from '../UI/SubmitButton/SubmitButton';
import CommentActions from './CommentActions';
import DateTime from '../DateTime/DateTime';
type CommentProps = {
  comment: BlogCommentType;
  userId?: User['id'];
};

const Comment = ({ comment, userId }: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const editCommentAction = async (formData: FormData) => {
    const text = formData.get('text');
    if (text !== '') {
      await pb.collection('comments').update(comment.id.toString(), {
        text: text,
      });
      setIsEditing(false);
    }
  };

  const handleDeleteComment = async () => {
    const confirmMsg = confirm('Do you want to delete this comment?');
    if (confirmMsg) {
      await pb.collection('comments').delete(comment.id.toString());
    }
  };
  const handleEditState = (isEditing: boolean) => {
    setIsEditing(isEditing);
  };

  return (
    <Box
      className='comment'
      width='100%'
      display='flex'
      py='10px'
      alignItems='center'
      key={comment.id}
      justifyContent='space-between'
      px='10px'
      gap='10px'
      flexDirection='row'
      bgColor='#060608'
      flexWrap='wrap'
      minHeight='100px'
      rounded='sm'
      boxShadow='lg'
    >
      <Box
        bgColor='transparent'
        gap='15px'
        display='flex'
        alignItems='start'
        justifyContent='center'
        flexDirection='column'
        flexWrap='wrap'
      >
        {isEditing ? (
          <Box
            display='flex'
            as='form'
            action={editCommentAction}
            width='100%'
            bgColor='transparent'
            alignItems='flex-start'
            py='15px'
            justifyContent='flex-start'
            flexDirection='column'
            gap='10px'
          >
            <Textarea
              resize='none'
              width='400px'
              rounded='none'
              name='text'
              placeholder='Edit comment'
              border='1px'
              borderColor='#282828	'
              color='white'
              _placeholder={{
                padding: '0',
                margin: '0',
                textAlign: 'left',
                color: 'white',
              }}
              required
            />

            <Box
              bgColor='transparent'
              display='flex'
              flexDirection='row'
              justifyContent='center'
              alignItems='center'
              flexWrap='wrap'
              gap='10px'
            >
              <SubmitButton size='sm' />
              <Button
                color='white'
                _hover={{
                  bgColor: 'white',
                  color: 'black',
                }}
                size='sm'
                type='button'
                variant='outline'
                onClick={() => handleEditState(false)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box
              display='flex'
              flexDirection='row'
              bgColor='transparent'
              alignItems='center'
              justifyContent='center'
              gap='10px'
              flexWrap='wrap'
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

              <Box display='flex' gap='2px' bgColor='transparent' flexDirection='column' flexWrap='wrap'>
                <Link
                  to={userId === comment?.expand?.user?.id ? '/profile' : `/user/${comment?.expand?.user?.id}`}
                  as={RouterLink}
                  bgColor='transparent'
                  fontSize='sm'
                  fontWeight='normal'
                >
                  {comment?.expand?.user?.username}
                </Link>
                <DateTime
                  style={{
                    fontSize: '12px',
                    color: '#CBD5E0',
                    backgroundColor: 'transparent',
                    fontWeight: 'normal',
                  }}
                  date={comment.created as string}
                />
              </Box>
            </Box>
            <Text bgColor='transparent' fontSize='md' fontWeight='normal'>
              {comment.text}
            </Text>
            <CommentActions comment={comment} />
          </>
        )}
      </Box>

      {userId === comment?.expand?.user.id && (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexDirection='row'
          flexWrap='wrap'
          gap='10px'
          bgColor='transparent'
        >
          <IconButton
            aria-label='Edit'
            fontSize={['sm', 'md', 'md']}
            fontWeight='normal'
            onClick={() => handleEditState(true)}
            bgColor='#0766eb'
            _hover={{
              bgColor: 'blue.500',
            }}
            color='white'
            icon={
              <Pencil
                style={{
                  backgroundColor: 'transparent',
                }}
                fontSize='20px'
                color='white'
              />
            }
          ></IconButton>
          <Button
            fontSize={['sm', 'md', 'md']}
            fontWeight='normal'
            onClick={handleDeleteComment}
            colorScheme='secondaryRed'
            bgColor='red.600'
          >
            Delete
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Comment;

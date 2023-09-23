import { Box, Icon, Text } from '@chakra-ui/react';
import { Heart } from '@phosphor-icons/react';
import { AppState, useStore } from '../../lib/store';
import { BlogCommentType } from '../../types/Blog';
import { likeComment, unlikeComment } from '../../services/blogAPI';

type CommentActionsType = {
  comment: BlogCommentType;
};

const CommentActions = ({ comment }: CommentActionsType) => {
  const user = useStore((state: AppState) => state.user);

  const handleLikeComment = async () => {
    if (user?.id) {
      await likeComment({
        comment: comment,
        userID: user?.id,
      });
    }
  };
  const handleUnlikeComment = async () => {
    if (user?.id) {
      await unlikeComment({
        comment: comment,
        userID: user?.id,
      });
    }
  };
  return (
    <Box
      width='100%'
      display='flex'
      alignItems='center'
      justifyContent='start'
      flexDirection='row'
      bgColor='transparent'
      gap='8px'
    >
      {comment?.likes?.includes(user?.id as string) ? (
        <Icon
          bgColor='transparent'
          color='#DD2942'
          aria-label='Like Button'
          as={Heart}
          weight='fill'
          cursor='pointer'
          onClick={handleUnlikeComment}
        />
      ) : (
        <Icon
          bgColor='transparent'
          color='white'
          aria-label='Like Button'
          as={Heart}
          weight='bold'
          cursor='pointer'
          onClick={handleLikeComment}
        />
      )}
      <Text fontSize='md' fontWeight='normal' bgColor='inherit'>
        {comment?.likes?.length || 0}
      </Text>
    </Box>
  );
};

export default CommentActions;

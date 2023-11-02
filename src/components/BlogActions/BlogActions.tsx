import { Wrap, Icon, Menu, MenuItem, MenuButton, MenuList, IconButton, Box, Text } from '@chakra-ui/react';
import { FC, startTransition, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogActionsProps, BlogType } from '../../types/Blog';
import { useStore, AppState } from '../../lib/store';
import EditBlogModal from '../modals/EditBlogModal/EditBlogModal';
import { Heart, DotsThreeOutlineVertical as MoreVertical } from '@phosphor-icons/react';
import { deleteBlog, likeBlog, unlikeBlog } from '../../services/blogAPI';
import { useQueryClient } from '@tanstack/react-query';

const BlogActions: FC<BlogActionsProps> = ({ blog }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useStore((state: AppState) => state.user);
  const onClose = () => {
    setIsOpen(false);
  };

  const handleLikeBlog = async () => {
    if (user?.id) {
      return await likeBlog({
        blog: {
          id: blog.id,
          likes: blog.likes,
        } as BlogType,

        userID: user.id,
      });
    }
  };

  const handleUnlikeBlog = async () => {
    if (user?.id) {
      return await unlikeBlog({
        blog: {
          id: blog.id,
          likes: blog.likes,
        } as BlogType,
        userID: user.id,
      });
    }
  };

  const handleDeleteBlog = async () => {
    if (!blog.id) {
      return console.error('Blog is undefined');
    }

    const confirmMsg = confirm('Do you want to delete this blog?');
    if (confirmMsg) {
      await deleteBlog(blog.id);
      navigate('/');
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ['blogs'],
          refetchType: 'all',
        });
      });
    }
  };
  const handleShareBlog = async () => {
    await navigator?.share({
      title: document.title,
      url: window.location.href,
    });
  };

  return (
    <Wrap display='flex' alignItems='end' justifyContent='end' flexDirection='row'>
      <Box display='flex' alignItems='center' justifyContent='center' flexDirection='column' flexWrap='wrap'>
        {blog?.likes?.includes(user?.id as string) ? (
          <Icon as={Heart} cursor='pointer' color='#DD2942' weight='fill' onClick={handleUnlikeBlog} boxSize={7} />
        ) : (
          <Icon as={Heart} color='white' cursor='pointer' onClick={handleLikeBlog} boxSize={7} />
        )}
        <Text bgColor='transparent' py='5px' color='white'>
          {blog?.likes?.length}
        </Text>
      </Box>
      <>
        <Menu>
          <MenuButton
            color='white'
            _hover={{
              border: 'none',
            }}
            _active={{
              border: 'none',
            }}
            border='0'
            bgColor='transparent'
            boxSize={8}
            paddingBottom='5px'
            as={IconButton}
            icon={<MoreVertical weight='fill' size='24' />}
          ></MenuButton>
          <MenuList border='0' bgColor='#0c0c0e'>
            {blog.user === user?.id && (
              <>
                <MenuItem onClick={() => setIsOpen(true)} color='white' bgColor='transparent'>
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteBlog} color='white' bgColor='transparent'>
                  Delete
                </MenuItem>
              </>
            )}
            <MenuItem onClick={handleShareBlog} color='white' bgColor='transparent'>
              Share
            </MenuItem>
          </MenuList>
        </Menu>{' '}
        {isOpen && <EditBlogModal isOpen={isOpen} blog={blog} onClose={onClose} />}
      </>
    </Wrap>
  );
};

export default BlogActions;

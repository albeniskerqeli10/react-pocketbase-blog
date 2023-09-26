import { Wrap, Icon, Menu, MenuItem, MenuButton, MenuList, IconButton, Box, Text } from '@chakra-ui/react';
import { FC, useState, startTransition, FormEvent, unstable_useCacheRefresh as useCacheRefresh } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import { BlogFormValues, BlogActionsProps } from '../../types/Blog';
import { useStore, AppState } from '../../lib/store';
import EditBlogModal from '../modals/EditBlogModal/EditBlogModal';
import { Heart, DotsThreeOutlineVertical as MoreVertical } from '@phosphor-icons/react';
import { deleteBlog, editBlog, likeBlog, unlikeBlog } from '../../services/blogAPI';

const BlogActions: FC<BlogActionsProps> = ({ blog }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const user = useStore((state: AppState) => state.user);
  const refreshCache = useCacheRefresh();
  const { values, handleChange, resetForm } = useForm<BlogFormValues>({
    title: '',
    content: '',
    image: '',
  });
  const onClose = () => {
    setIsOpen(false);
  };

  const handleLikeBlog = async () => {
    if (user?.id) {
      return await likeBlog({
        blog: blog,
        userID: user.id,
      });
    }
  };

  const handleUnlikeBlog = async () => {
    if (user?.id) {
      return await unlikeBlog({
        blog: blog,
        userID: user.id,
      });
    }
  };

  const handleEditBlogPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const editedBlog = await editBlog({
      blog: blog,
      values: values,
    });
    if (editedBlog) {
      startTransition(() => {
        onClose();
        resetForm();
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

      startTransition(() => {
        refreshCache();
        navigate('/');
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
        <Menu isLazy>
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
        {isOpen && (
          <EditBlogModal
            handleSubmit={handleEditBlogPost}
            handleChange={handleChange}
            isOpen={isOpen}
            blog={blog}
            onClose={onClose}
          />
        )}
      </>
    </Wrap>
  );
};

export default BlogActions;

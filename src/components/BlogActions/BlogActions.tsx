import { Wrap, Icon, Menu, MenuItem, MenuButton, MenuList, IconButton, Box, Text } from '@chakra-ui/react';
import { FC, useState, startTransition, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import { BlogFormValues, BlogActionsProps, BlogType } from '../../types/Blog';
import { useStore, AppState } from '../../lib/store';
import EditBlogModal from '../modals/EditBlogModal/EditBlogModal';
import { pb } from '../../lib/pocketbase';
import { Heart, DotsThreeOutlineVertical as MoreVertical } from '@phosphor-icons/react';

const BlogActions: FC<BlogActionsProps> = ({ blog, onUpdate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const user = useStore((state: AppState) => state.user);
  const { values, handleChange, resetForm } = useForm<BlogFormValues>({
    title: '',
    content: '',
    image: '',
  });
  const onClose = () => {
    setIsOpen(false);
  };

  const handleLikeBlog = async () => {
    const existingBlogLikes: Array<string> = blog.likes;
    pb.collection('blogs').update(blog.id, {
      likes: [...existingBlogLikes, user?.id],
      user: blog.user,
    });
  };

  const handleUnlikeBlog = async () => {
    const existingBlogLikes: Array<string> = blog.likes;

    const newLikes = existingBlogLikes?.filter((likeId: string) => likeId !== user?.id);

    await pb.collection('blogs').update(blog.id, {
      likes: newLikes,
      user: blog.user,
    });
  };

  const handleEditBlogPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedBlog: BlogType = await pb.collection('blogs').update(
        blog.id as string,
        {
          title: values.title !== '' ? values.title : blog.title,
          content: values.content !== '' ? values.content : blog.content,
          image: values.image !== '' ? values.image : blog.image,
        },
        {
          expand: 'user',
        },
      );
      startTransition(() => {
        onUpdate(updatedBlog);
        onClose();
        resetForm();
      });
    } catch (err) {
      alert('Something went wrong, try again');
    }
  };

  const handleDeleteBlog = async () => {
    const confirmMsg = confirm('Do you want to delete this blog?');
    if (confirmMsg) {
      await pb.collection('blogs').delete(blog.id as string);

      startTransition(() => {
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
      {blog.user === user?.id && (
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
              icon={<MoreVertical size='24' />}
            ></MenuButton>
            <MenuList border='0' bgColor='black'>
              <MenuItem onClick={() => setIsOpen(true)} color='white' bgColor='transparent'>
                Edit
              </MenuItem>
              <MenuItem onClick={handleDeleteBlog} color='white' bgColor='transparent'>
                Delete
              </MenuItem>
              <MenuItem onClick={handleShareBlog} color='white' bgColor='transparent'>
                Share
              </MenuItem>
            </MenuList>
          </Menu>{' '}
          <EditBlogModal
            handleSubmit={handleEditBlogPost}
            handleChange={handleChange}
            isOpen={isOpen}
            onClose={onClose}
          />
        </>
      )}
    </Wrap>
  );
};

export default BlogActions;

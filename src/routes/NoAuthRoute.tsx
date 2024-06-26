import { useState, FC, startTransition, use } from 'react';
import { Box, Tab } from '@chakra-ui/react';
import { getBlogs } from '../services/blogAPI';
import TabsList from '../components/UI/TabsList/TabsList';
import BlogsList from '../components/BlogsList/BlogsList';
const NoAuthRoute: FC = () => {
  const [sortField, setSortField] = useState('-created');
  const blogs = getBlogs(sortField);

  const handleSortBlogs = async (fieldName: string) => {
    startTransition(() => {
      setSortField(fieldName);
    });
  };

  return (
    <Box
      width='100%'
      as='section'
      py='10px'
      display='flex'
      alignItems='center'
      justifyContent='start'
      flexDirection='row'
      gap='20px'
      flexWrap='wrap'
      overflowY='auto'
    >
      <Box width='100%' border='0' display='flex' alignItems='center' flexDirection='row' justifyContent='start'>
        <TabsList>
          <Tab onClick={() => sortField !== '-created' && handleSortBlogs('-created')}>Latest</Tab>
          <Tab
            _active={{
              bgColor: 'transparent',
            }}
            onClick={() => sortField !== '-likes' && handleSortBlogs('-likes')}
          >
            Popular
          </Tab>
        </TabsList>
      </Box>
      {/* */}
      <BlogsList blogs={use(blogs) as any} />
    </Box>
  );
};
export default NoAuthRoute;

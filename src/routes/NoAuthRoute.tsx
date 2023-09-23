import { useEffect, useState, FC, use, unstable_useCacheRefresh as useCacheRefresh, startTransition } from 'react';

import { Box, Tab, TabList, Tabs } from '@chakra-ui/react';
import { pb } from '../lib/pocketbase';
import { BlogType } from '../types/Blog';
import { getBlogs } from '../services/blogAPI';
import BlogsList from '../components/BlogsList/BlogsList';
const NoAuthRoute: FC = () => {
  const [sortField, setSortField] = useState('-created');
  getBlogs('-created');

  const blogs = use(getBlogs(sortField)) as BlogType[];
  const refreshCache = useCacheRefresh();

  useEffect(() => {
    pb.collection('blogs').subscribe('*', async function () {
      startTransition(() => {
        refreshCache();
      });
    });
  }, [refreshCache]);

  const handleSortBlogs = async (sortName: string) => {
    startTransition(() => {
      setSortField(sortName);
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
    >
      <Box width='100%' border='0' display='flex' alignItems='center' flexDirection='row' justifyContent='start'>
        <Tabs colorScheme='red' color='white'>
          <TabList display='flex' justifyContent='stretch' border='0'>
            <Tab
              _active={{
                bgColor: 'transparent',
              }}
              onClick={() => sortField !== '-created' && handleSortBlogs('-created')}
            >
              Latest
            </Tab>
            <Tab
              _active={{
                bgColor: 'transparent',
              }}
              onClick={() => sortField !== 'likes' && handleSortBlogs('likes')}
            >
              Popular
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      <BlogsList blogs={blogs} />
    </Box>
  );
};
export default NoAuthRoute;

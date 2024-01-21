import { Box, Input } from '@chakra-ui/react';
import { startTransition } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
const SearchBox = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  return (
    <Box
      width={['100%', 'auto', 'auto']}
      my={['5px', 0, 0]}
      flex={['initial', 0.8, 0.6]}
      order={[1, 0, 0]}
      display='flex'
      alignItems='center'
      justifyContent='center'
      flexDirection='row'
      flexWrap='wrap'
    >
      <Input
        // 232229
        bgColor='#060608'
        color='white'
        boxShadow='md'
        appearance='auto'
        py='23px'
        defaultValue={query || ''}
        flex={[1, 1, 0.8]}
        border='0'
        onChange={(e) => {
          startTransition(() => {
            navigate(e.target.value !== '' ? `/search?q=${e.target.value}` : '/');
          });
        }}
        _placeholder={{
          color: '#ececec',
        }}
        type='search'
        name='q'
        placeholder='Search for blogs or users...'
      />
    </Box>
  );
};

export default SearchBox;

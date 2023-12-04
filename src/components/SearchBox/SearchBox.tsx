import { Box, Input } from '@chakra-ui/react';
import { startTransition } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
const SearchBox = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get('q');
  return (
    <Box
      flex={['initial', 0.8, 0.6]}
      width={['100%', 'auto', 'auto']}
      order={[1, 0, 0]}
      display='flex'
      alignItems='center'
      justifyContent='center'
      flexDirection='row'
      flexWrap='wrap'
    >
      <Input
        // 232229
        bgColor=' #0c0c0e'
        color='white'
        boxShadow='md'
        py='23px'
        defaultValue={query || ''}
        border='0'
        onChange={(e) => {
          if (e.target.value !== '') {
            startTransition(() => {
              navigate(`/search?q=${e.target.value}`);
            });
          } else {
            startTransition(() => {
              navigate(`/`);
            });
          }
        }}
        _placeholder={{
          color: 'white',
        }}
        type='search'
        name='q'
        placeholder='Search blogs'
      />
    </Box>
  );
};

export default SearchBox;

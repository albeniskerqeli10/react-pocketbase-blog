import { Box, Input } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { startTransition } from 'react';
const SearchBox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  return (
    <Box flex='0.6' display='flex' alignItems='center' justifyContent='center' flexDirection='row' flexWrap='wrap'>
      <Input
        bgColor='black'
        color='white'
        py='23px'
        border='0'
        value={query || ''}
        onChange={(e) => {
          startTransition(() => {
            if (e.target.value !== '') {
              navigate(`/search?q=${e.target.value}`);
            } else {
              navigate(`/`);
            }
          });
        }}
        _placeholder={{
          color: 'white',
        }}
        type='search'
        placeholder='Search blogs'
      />
    </Box>
  );
};

export default SearchBox;

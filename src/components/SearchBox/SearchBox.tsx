import { Box, Input } from '@chakra-ui/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
const SearchBox = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  return (
    <Box flex='0.6' display='flex' alignItems='center' justifyContent='center' flexDirection='row' flexWrap='wrap'>
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
            navigate(`/search?q=${e.target.value}`);
          } else {
            navigate(`/`);
          }
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

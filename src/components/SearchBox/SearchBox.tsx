import { Box, Input } from '@chakra-ui/react';
import { ChangeEvent, startTransition, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const debounceTimeout = useRef<number>(); // To store the timeout ID

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      startTransition(() => {
        navigate(e.target.value !== '' ? `/search?q=${e.target.value}` : '/');
      });
    }, 500);
  };

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
        key={query}
        bgColor='#060608'
        color='white'
        boxShadow='md'
        appearance='auto'
        py='23px'
        defaultValue={query || ''}
        flex={[1, 1, 0.8]}
        border='0'
        onChange={handleInputChange}
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

import { Box, Text, Input, IconButton, Spinner } from '@chakra-ui/react';
import { FC, Suspense, useState, useRef } from 'react';
import TagsList from '../UI/TagsList/TagsList';
import { XCircle } from '@phosphor-icons/react';
import { Tag } from '../../types/Blog';

type TagInputProps = {
  tags: Tag[];
  handleTagClick: (tag: Tag) => void;
  handleDeleteTag: (tagID: number) => void;
};

const TagInput: FC<TagInputProps> = ({ tags, handleTagClick, handleDeleteTag }) => {
  const [tagInput, setTagInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Box
      width='100%'
      bgColor='#0c0c0e'
      display='flex'
      alignItems='center'
      justifyContent='start'
      flexDirection='column'
      gap='5px'
      px='10px'
      py='10px'
    >
      <Box width='100%' display='flex' alignItems='center' justifyContent='center' bgColor='transparent' gap='5px'>
        {tags?.length > 0 &&
          tags?.map((tag) => (
            <Box
              key={tag.id}
              width='auto'
              display='flex'
              alignItems='center'
              justifyContent='center'
              px='5px'
              pl='10px'
              py='10px'
              gap='6px'
              flexDirection='row'
              rounded='md'
              bgColor='black'
            >
              <Text bgColor='transparent'>{tag.name}</Text>
              <IconButton
                size='xs'
                _hover={{
                  bgColor: 'transparent',
                }}
                bgColor='transparent'
                color='white'
                aria-label='Delete tag'
                icon={
                  <XCircle
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    size='20'
                  />
                }
                onClick={() => handleDeleteTag(tag.id)}
              />
            </Box>
          ))}
        <Input
          name='tag'
          ref={inputRef}
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
          }}
          boxShadow='sm'
          rounded='md'
          bgColor='inherit'
          my='5px'
          py='25px'
          border='0'
          type='text'
          _focus={{
            boxShadow: 'none',
            border: 'none',
          }}
          placeholder='Write some tags e.g react,vue etc'
          _placeholder={{
            color: 'white',
          }}
        />
      </Box>
      <Suspense fallback={<Spinner colorScheme='white' color='white' />}>
        <TagsList
          query={tagInput}
          handleTagClick={(tag) => {
            handleTagClick(tag);
            setTagInput('');
            inputRef.current?.focus();
          }}
        />
      </Suspense>
    </Box>
  );
};

export default TagInput;

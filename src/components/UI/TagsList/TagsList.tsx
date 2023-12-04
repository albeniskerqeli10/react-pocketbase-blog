import { FC, use } from 'react';
import { getBlogTags } from '../../../services/blogAPI';
import { Box, Text } from '@chakra-ui/react';
import { Tag } from '../../../types/Blog';

type TagsListProps = {
  query: string;
  handleTagClick: (tag: Tag) => void;
};

const TagsList: FC<TagsListProps> = ({ query, handleTagClick }) => {
  const tags = query !== '' ? (use(getBlogTags(query)) as Tag[]) : [];

  return (
    query !== '' && (
      <Box
        width='100%'
        bgColor='black'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexWrap='wrap'
        flexDirection='column'
        borderWidth='2px'
        borderColor='#1b1b1d'
        gap='5px'
        mb='10px'
        rounded='md'
      >
        {tags?.length > 0 ? (
          tags?.map((tag: Tag) => (
            <Text
              _hover={{
                bgColor: '#1b1b1d',
              }}
              py='10px'
              px='10px'
              rounded='sm'
              bgColor='transparent'
              width='100%'
              onClick={() => handleTagClick(tag)}
              key={tag.id}
            >
              {tag.name}
            </Text>
          ))
        ) : (
          <Text px='10px' bgColor='transparent'>
            No tags found
          </Text>
        )}
      </Box>
    )
  );
};

export default TagsList;

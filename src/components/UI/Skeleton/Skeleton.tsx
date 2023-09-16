import { Stack, Box, SkeletonCircle, Skeleton } from '@chakra-ui/react';

type SkeletonProps = {
  width?: string;
  mainSkeletonHeight?: string;
};

const CustomSkeleton = ({ width, mainSkeletonHeight }: SkeletonProps) => {
  return (
    <Stack width={width || '600px'} mt='0' spacing={5}>
      <Skeleton height={mainSkeletonHeight || '300px'} />
      <Box display='flex' alignItems='center' justifyContent='start' gap='10px' flexDirection='row'>
        <SkeletonCircle size='7' />

        <Skeleton width='200px' color='red' bgColor='red' height='15px' />
      </Box>
      <Skeleton height='20px' />
    </Stack>
  );
};

export default CustomSkeleton;

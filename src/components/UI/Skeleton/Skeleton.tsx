import { Stack, Box, SkeletonCircle, Skeleton } from '@chakra-ui/react';

type SkeletonProps = {
  width?: string;
  mainSkeletonHeight?: string;
};

const CustomSkeleton = ({ width, mainSkeletonHeight }: SkeletonProps) => {
  return (
    <Stack width={width || '600px'} mt='0' spacing={5}>
      <Skeleton endColor='#0c0c0e' height={mainSkeletonHeight || '300px'} />
      <Box display='flex' alignItems='center' justifyContent='start' gap='10px' flexDirection='row'>
        <SkeletonCircle endColor='#0c0c0e' size='7' />

        <Skeleton endColor='#0c0c0e' width='200px' color='red' bgColor='red' height='15px' />
      </Box>
      <Skeleton endColor='#0c0c0e' height='20px' />
    </Stack>
  );
};

export default CustomSkeleton;

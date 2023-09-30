import { TabIndicator, Tabs, TabList } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

type TabListProps = {
  children: ReactNode;
};

const TabsList: FC<TabListProps> = ({ children }) => {
  return (
    <Tabs colorScheme='red' bgColor='yellow' variant='unstyled' color='white'>
      <TabList display='flex' justifyContent='stretch' border='0'>
        {children}
      </TabList>
      <TabIndicator mt='-1.5px' height='2px' bg='red.500' borderRadius='1px' />
    </Tabs>
  );
};

export default TabsList;

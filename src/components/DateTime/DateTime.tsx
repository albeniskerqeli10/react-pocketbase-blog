import { ComponentPropsWithoutRef } from 'react';
import TimeAgo from 'timeago-react';

type DateTimeProps = {
  date: string;
} & ComponentPropsWithoutRef<'time'>;

const DateTime = ({ date, ...rest }: DateTimeProps) => {
  return (
    <TimeAgo
      style={{
        fontSize: '12px',
      }}
      live={false}
      datetime={date}
      {...rest}
    />
  );
};

export default DateTime;

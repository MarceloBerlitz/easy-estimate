import { Avatar, Space, Typography } from 'antd';
import { useMemo } from 'react';
import { OnlineIndicator } from './partials/OnlineIndicator/OnlineIndicator';

const getColor = (name: string): string => {
  const colors = [
    '#fa541c',
    '#fa371c',
    '#1c9dfa',
    '#1cfa6d',
    '#f5a623',
    '#f50a23',
    '#1cfa6d',
    '#1c9dfa',
  ];
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length];
};

type Props = {
  name: string;
  showStatus?: boolean;
  isOnline?: boolean;
};
export const Voter = ({ name, showStatus, isOnline }: Props) => {
  const color = useMemo(() => {
    return getColor(name);
  }, [name]);

  return (
    <Space size={12}>
      <Avatar
        style={{
          color,
          backgroundColor: `${color}33`,
          verticalAlign: 'middle',
          textTransform: 'capitalize',
        }}
        size="default"
      >
        {name?.substring(0, 1)}
      </Avatar>
      {showStatus ? <OnlineIndicator isOnline={!!isOnline} /> : null}
      <Typography
        style={{
          margin: 'auto',
          fontSize: 16,
          marginLeft: showStatus ? '-32px' : '0',
        }}
      >
        {name}
      </Typography>
    </Space>
  );
};

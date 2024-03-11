import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Avatar, Space, Switch, Typography } from 'antd';
import { CustomHeader } from '../../styles';

type Props = {
  name: string;
  isDarkMode: boolean;
  onDarkModeChange: (checked: string) => void;
};

export const Header = ({ name, isDarkMode, onDarkModeChange }: Props) => {
  return (
    <CustomHeader>
      <div>
        <Space>
          <Typography.Title level={3} style={{ margin: 'auto' }}>
            Easy Estimate
          </Typography.Title>
        </Space>
        <Space>
          <Switch
            defaultValue={isDarkMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            onChange={(checked) => onDarkModeChange(String(checked))}
          />
          <Space>
            <Avatar style={{ backgroundColor: '#1c6ed2', verticalAlign: 'middle' }} size="large">
              {name?.substring(0, 1)}{' '}
            </Avatar>
            <Typography.Title level={3} style={{ margin: 'auto' }}>
              {name}
            </Typography.Title>
          </Space>
        </Space>
      </div>
    </CustomHeader>
  );
};

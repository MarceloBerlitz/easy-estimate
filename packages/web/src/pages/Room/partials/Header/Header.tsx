import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Space, Switch, Typography } from 'antd';
import { Voter } from '../../../../components/Voter/Voter';
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
          <Typography.Title level={4} style={{ margin: 'auto' }}>
            Easy Estimate
          </Typography.Title>
        </Space>
        <Space size={16}>
          <Switch
            defaultValue={isDarkMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            onChange={(checked) => onDarkModeChange(String(checked))}
          />
          <Voter name={name} />
        </Space>
      </div>
    </CustomHeader>
  );
};

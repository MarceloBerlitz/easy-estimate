import { Table } from 'antd';

const columns = [
  {
    title: 'Combination (any order)',
    children: [
      {
        title: 'Complexity',
        dataIndex: 'complexity',
        key: 'key',
      },
      {
        title: 'Effort',
        dataIndex: 'effort',
        key: 'key',
      },
      {
        title: 'Risk',
        dataIndex: 'risk',
        key: 'key',
      },
    ],
  },
  {
    title: 'Story Points',
    dataIndex: 'storyPoints',
    key: 'key',
    align: 'right' as any,
  },
];

export const CriteriaBoard = () => {
  return (
    <Table
      pagination={{
        hideOnSinglePage: true,
      }}
      columns={columns}
      dataSource={[
        { key: 1, complexity: 'Small', effort: 'Small', risk: 'Small', storyPoints: 1 },
        { key: 2, complexity: 'Small', effort: 'Small', risk: 'Medium', storyPoints: 2 },
        { key: 3, complexity: 'Small', effort: 'Small', risk: 'Large', storyPoints: 3 },
        { key: 4, complexity: 'Small', effort: 'Medium', risk: 'Medium', storyPoints: 3 },
        { key: 5, complexity: 'Small', effort: 'Medium', risk: 'Large', storyPoints: 5 },
        { key: 6, complexity: 'Medium', effort: 'Medium', risk: 'Medium', storyPoints: 5 },
        { key: 7, complexity: 'Small', effort: 'Large', risk: 'Large', storyPoints: 8 },
        { key: 8, complexity: 'Medium', effort: 'Medium', risk: 'Large', storyPoints: 8 },
        { key: 9, complexity: 'Medium', effort: 'Large', risk: 'Large', storyPoints: 13 },
        { key: 10, complexity: 'Large', effort: 'Large', risk: 'Large', storyPoints: 21 },
      ]}
    />
  );
};

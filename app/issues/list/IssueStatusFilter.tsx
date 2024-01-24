'use client';

import { Status } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';

const IssueStatusFilter = () => {
  const router = useRouter();
  const allStatusesValue = 'all';
  const statuses: { label: string; value: Status | typeof allStatusesValue }[] =
    [
      {
        label: 'All',
        value: 'all',
      },
      { label: 'Open', value: 'OPEN' },
      { label: 'In Progress', value: 'IN_PROGRESS' },
      { label: 'Closed', value: 'CLOSED' },
    ];
  return (
    <Select.Root
      onValueChange={(status) => {
        const query = status !== allStatusesValue ? `?status=${status}` : '';
        router.push('/issues/list' + query);
      }}
    >
      <Select.Trigger placeholder="Filter by status..." />
      <Select.Content>
        {statuses.map((status) => (
          <Select.Item key={status.value} value={status.value}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;

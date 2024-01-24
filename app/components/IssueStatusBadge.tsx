import { Status } from '@prisma/client';
import { Badge } from '@radix-ui/themes';
import React from 'react';

const statusMap: Record<
  Status,
  { label: string; color: 'red' | 'violet' | 'green' }
> = {
  [Status.OPEN]: { label: 'Open', color: 'red' },
  [Status.IN_PROGRESS]: { label: 'In Progress', color: 'violet' },
  [Status.CLOSED]: { label: 'Closed', color: 'green' },
};

const IssueStatusBadge = ({ status }: { status: Status }) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default IssueStatusBadge;

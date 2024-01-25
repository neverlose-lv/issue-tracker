import { Status } from '@prisma/client';
import { Card, Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';
import React from 'react';

interface Props {
  data: {
    open: number;
    inProgress: number;
    closed: number;
  };
}

const IssueSummary = ({ data: { open, inProgress, closed } }: Props) => {
  const containers: { label: string; value: number; status: Status }[] = [
    {
      label: 'Issues Open',
      value: open,
      status: 'OPEN',
    },
    {
      label: 'Issues In-progress',
      value: inProgress,
      status: 'IN_PROGRESS',
    },
    {
      label: 'Issues Closed',
      value: closed,
      status: 'CLOSED',
    },
  ];
  return (
    <Flex gap="4">
      {containers.map((container) => (
        <Card key={container.status}>
          <Link href={`/issues/list?status=${container.status}`}>
            <Flex gap="1" direction="column">
              <Text size="2" className="font-medium">
                {container.label}
              </Text>
              <Text size="5" className="font-bold">
                {container.value}
              </Text>
            </Flex>
          </Link>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;

import { Avatar, Card, Flex, Heading, Table } from '@radix-ui/themes';
import React from 'react';
import prisma from '@/prisma/client';
import Link from 'next/link';
import { IssueStatusBadge } from './components';

const LatestIssues = async () => {
  const issues = await prisma.issue.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  return (
    <Card>
      <Heading size="4" mb="5">
        Latest Issues
      </Heading>
      <Table.Root>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Flex justify="between">
                  <Link href={`/issues/${issue.id}`}>
                    <Flex
                      direction="column"
                      gap="2"
                      align="start"
                      className="cursor-pointer"
                    >
                      {issue.title}
                      <IssueStatusBadge status={issue.status} />
                    </Flex>
                  </Link>
                  {issue.assignedToUser && (
                    <Avatar
                      src={issue.assignedToUser.image!}
                      fallback="?"
                      size="2"
                      radius="full"
                    />
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestIssues;

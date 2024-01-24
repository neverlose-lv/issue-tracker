import { IssueStatusBadge } from '@/app/components';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { Table } from '@radix-ui/themes';
import Link from 'next/link';
import React from 'react';
import NextLink from 'next/link';
import { Issue, Status } from '@prisma/client';

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;
  dir: 'desc' | undefined;
  page: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink
                href={{
                  query: getQuery(searchParams, column),
                }}
              >
                {column.label}
                {column.value === searchParams.orderBy &&
                  (searchParams.dir === 'desc' ? (
                    <ArrowDownIcon className="inline" />
                  ) : (
                    <ArrowUpIcon className="inline" />
                  ))}
              </NextLink>
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues.map((issue) => (
          <Table.Row key={issue.id}>
            <Table.Cell>
              <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
              <div className="block md:hidden">
                <IssueStatusBadge status={issue.status} />
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <IssueStatusBadge status={issue.status} />
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {issue.createdAt.toDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const getQuery = (searchParams: IssueQuery, column: IssueColumn) => {
  let query = { ...searchParams };
  if (query.orderBy === column.value) {
    if (query.dir === 'desc') {
      query.dir = undefined;
    } else {
      query.dir = 'desc';
    }
  } else {
    query.dir = undefined;
    query.orderBy = column.value;
  }

  return query;
};

interface IssueColumn {
  label: string;
  value: keyof Issue;
  className?: string;
}

const columns: IssueColumn[] = [
  { label: 'Issue', value: 'title' },
  { label: 'Status', value: 'status', className: 'hidden md:table-cell' },
  { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
];

export const columnNames = columns.map((column) => column.value);

export default IssueTable;

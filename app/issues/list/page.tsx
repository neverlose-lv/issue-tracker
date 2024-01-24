import { IssueStatusBadge, Link } from '@/app/components';
import prisma from '@/prisma/client';
import { Issue, Status } from '@prisma/client';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { Table } from '@radix-ui/themes';
import NextLink from 'next/link';
import IssueActions from './IssueActions';
import Pagination from '@/app/components/Pagination';

interface SearchParams {
  status: Status;
  orderBy: keyof Issue;
  dir: 'desc' | undefined;
  page: string;
}

interface Props {
  searchParams: SearchParams;
}

interface IssueColumn {
  label: string;
  value: keyof Issue;
  className?: string;
}

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: IssueColumn[] = [
    { label: 'Issue', value: 'title' },
    { label: 'Status', value: 'status', className: 'hidden md:table-cell' },
    { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
  ];

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const dir = searchParams.dir === 'desc' ? 'desc' : 'asc';

  const orderBy = columns
    .map((column) => column.value)
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: dir }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const where = { status };

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  const getQuery = (searchParams: SearchParams, column: IssueColumn) => {
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

  return (
    <div>
      <IssueActions />
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
      <div className="mt-3">
        <Pagination
          pageSize={pageSize}
          currentPage={page}
          itemCount={issueCount}
        />
      </div>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default IssuesPage;

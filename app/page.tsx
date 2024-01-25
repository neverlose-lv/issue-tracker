import { Flex, Grid } from '@radix-ui/themes';
import IssueChart from './IssueChart';
import IssueSummary from './IssueSummary';
import LatestIssues from './LatestIssues';
import prisma from '@/prisma/client';

export default async function Home() {
  const open = await prisma.issue.count({ where: { status: 'OPEN' } });
  const inProgress = await prisma.issue.count({
    where: { status: 'IN_PROGRESS' },
  });
  const closed = await prisma.issue.count({ where: { status: 'CLOSED' } });

  const data = { open, inProgress, closed };

  return (
    <Grid columns={{ initial: '1', md: '2' }} gap="5">
      <Flex direction="column" gap="5">
        <IssueSummary data={data} />
        <IssueChart data={data} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}

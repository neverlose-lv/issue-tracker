import { Pencil2Icon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import Link from 'next/link';
import React from 'react';

const EditIssueButton = ({ issueId }: { issueId: number }) => {
  return (
    <Button>
      <Link href={`/issues/${issueId.toString()}/edit`}>
        <Pencil2Icon className="inline mr-1 align-middle size-5 pb-1 -ml-1" />
        Edit Issue
      </Link>
    </Button>
  );
};

export default EditIssueButton;
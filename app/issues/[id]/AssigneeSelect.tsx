'use client';

import { Skeleton } from '@/app/components';
import { Issue, User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return null;
  }

  const assignIssue = (userId: string) => {
    axios
      .patch('/Xapi/issues/' + issue.id, {
        assignedToUserId: userId === unassignedValue ? null : userId,
      })
      .catch(() => {
        toast.error('Changes could not be saved.');
      });
  };

  const unassignedValue = 'unassigned';

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || unassignedValue}
        onValueChange={assignIssue}
      >
        <Select.Trigger placeholder="Assign ..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value={unassignedValue}>Unassigned</Select.Item>
            {users?.map((user: User) => {
              return (
                <Select.Item key={user.id} value={user.id}>
                  {user.name}
                </Select.Item>
              );
            })}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      return axios.get<User[]>('/api/users').then((res) => res.data);
    },
    staleTime: 60 * 1000, // 60 seconds
    retry: 3,
  });

export default AssigneeSelect;

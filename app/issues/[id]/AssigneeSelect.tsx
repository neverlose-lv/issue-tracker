'use client';

import { Issue, User } from '@prisma/client';
import { Select } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Skeleton } from '@/app/components';
import toast, { Toaster } from 'react-hot-toast';

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      return axios.get<User[]>('/api/users').then((res) => res.data);
    },
    staleTime: 60 * 1000, // 60 seconds
    retry: 3,
  });

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return null;
  }

  const unassignedValue = 'unassigned';

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || unassignedValue}
        onValueChange={(userId) => {
          axios
            .patch('/Xapi/issues/' + issue.id, {
              assignedToUserId: userId === unassignedValue ? null : userId,
            })
            .catch(() => {
              toast.error('Changes could not be saved.');
            });
        }}
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

export default AssigneeSelect;

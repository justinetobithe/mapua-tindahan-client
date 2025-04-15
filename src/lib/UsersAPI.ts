'use client';
import { ProfileFormInputs } from '@/app/(protected)/profile/components/ProfileForm';
import { api } from '@/lib/api';
import Response from '@/types/Response';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { getServerSession } from 'next-auth';
import AuthOptions from '@/lib/AuthOptions';
import User, { UserPaginatedData } from '@/types/User';
import { UserInput } from '@/components/AppUserForm';

export const getUsers = async (
  page: number = 1,
  pageSize: number = 10,
  search = '',
  sortColumn = '',
  sortDesc = false
): Promise<UserPaginatedData> => {
  const response = await api.get<{ data: { data: User[]; current_page: number; last_page: number; total: number } }>(`/api/users`, {
    params: {
      page,
      ...(pageSize && { page_size: pageSize }),
      ...(search && { search }),
      ...(sortColumn && { sort_column: sortColumn }),
      sort_desc: sortDesc,
    },
  });

  const { data } = response.data;

  return {
    data: data.data,
    last_page: data?.last_page
  };
};

export const useUsers = (
  page: number = 1,
  pageSize: number = 10,
  search = '',
  sortColumn = '',
  sortDesc = false
) =>
  useQuery({
    queryKey: ['users', page, pageSize, search, sortColumn, sortDesc],
    queryFn: async (): Promise<UserPaginatedData> => {
      return await getUsers(page, pageSize, search, sortColumn, sortDesc);
    },
  });

export const createUser = async (inputs: UserInput): Promise<Response> => {
  const response = await api.post<Response>(`/api/user`, inputs, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateUser = async (id: string, inputs: UserInput | ProfileFormInputs | FormData): Promise<Response> => {
  const response = await api.put<Response>(`/api/user/${id}`, inputs, {
    headers: {
      'Content-Type': inputs instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
  });
  return response.data;
};

export const deleteUser = async (id: string, password?: string): Promise<Response> => {
  const response = await api.delete(`/api/user/${id}`, {
    data: password ? { password } : {},
  });
  return response.data;
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (inputs: UserInput) => {
      return await createUser(inputs);
    },
    onSuccess: (response) => {
      if (response && response.status === "success") {
        toast({
          variant: 'success',
          description: response.message,
        });
      }
    },
  });
};


export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: UserInput | ProfileFormInputs }) => {
      return await updateUser(id, userData);
    },
    onSuccess: async (response) => {
      console.log("response update", response)
      if (response && response.status === "success") {
        toast({
          variant: 'success',
          description: response.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: response.message,
        });
      }
      await getServerSession(AuthOptions);
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async ({ id, password }: { id: string; password?: string }) => {
      return await deleteUser(id, password);
    },
    onSuccess: (response) => {
      if (response && response.status === "success") {
        toast({
          variant: 'success',
          description: response.message,
        });
      }
    },
  });
};


/* HOOKS */
/* END HOOKS */

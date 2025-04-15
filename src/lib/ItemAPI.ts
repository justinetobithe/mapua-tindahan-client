import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Item } from '@/types/Item';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getItems = async (
    page: number = 1,
    pageSize: number = 10,
    search = '',
    sortColumn = '',
    sortDesc = false,
): Promise<{ data: Item[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Item[]; current_page: number; last_page: number; total: number } }>(`/api/items`, {
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
        last_page: data?.last_page,
    };
};

export const showItem = async (id: number): Promise<Response> => {
    const response = await api.get(`/api/item/${id}`);
    return response.data.data;
};

export const createItem = async (inputs: Item): Promise<Response> => {
    const response = await api.post<Response>(`/api/item`, inputs, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateItem = async (id: number, inputs: Item): Promise<Response> => {
    const response = await api.post<Response>(`/api/item/${id}`, inputs, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteItem = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/item/${id}`);
    return response.data;
};

export const getUserItems = async (
    userId?: number,
    search?: string,
): Promise<{ data: Item[] }> => {
    const response = await api.get<{ data: Item[] }>('/api/user-items', {
        params: {
            ...(userId && { user_id: userId }),
            ...(search && { search }),
        },
    });

    return response.data;
};

export const useItems = (
    page: number,
    pageSize: number,
    searchKeyword?: string,
    sortBy?: string,
    sortDesc?: boolean,
) => {
    return useQuery({
        queryKey: ['items', page, pageSize, searchKeyword, sortBy, sortDesc],
        queryFn: async () => {
            const response = await api.get('/api/items', {
                params: {
                    page,
                    per_page: pageSize,
                    search: searchKeyword,
                    sort_by: sortBy,
                    sort_desc: sortDesc,
                },
            });

            return response.data;
        },
    });
};

export const useShowItem = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await showItem(id);
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

export const useCreateItem = () => {
    return useMutation({
        mutationFn: async (inputs: Item) => {
            return await createItem(inputs);
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

export const useUpdateItem = () => {
    return useMutation({
        mutationFn: async ({ id, itemData }: { id: number; itemData: Item }) => {
            return await updateItem(id, itemData);
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

export const useDeleteItem = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deleteItem(id);
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


export const useUserItems = (userId?: number, search?: string) => {
    return useQuery({
        queryKey: ['items', userId, search],
        queryFn: async () => await getUserItems(userId, search),
    });
};

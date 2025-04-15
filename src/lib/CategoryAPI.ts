
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Response from '@/types/Response';
import { Category } from '@/types/Category';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getCategories = async (
    page: number = 1,
    pageSize: number = 10,
    search = '',
    sortColumn = '',
    sortDesc = false
): Promise<{ data: Category[]; last_page: number }> => {
    const response = await api.get<{ data: { data: Category[]; current_page: number; last_page: number; total: number } }>(`/api/categories`, {
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

export const showCategory = async (id: number): Promise<Response> => {
    const response = await api.get(`/api/category/${id}`);
    return response.data;
};

export const createCategory = async (inputs: Category): Promise<Response> => {
    const response = await api.post<Response>(`/api/category`, inputs);
    return response.data;
};

export const updateCategory = async (id: number, inputs: Category): Promise<Response> => {
    const response = await api.put<Response>(`/api/category/${id}`, inputs);
    return response.data;
};

export const deleteCategory = async (id: number): Promise<Response> => {
    const response = await api.delete(`/api/category/${id}`);
    return response.data;
};

export const useCategories = (
    page: number = 1,
    pageSize: number = 10,
    search = '',
    sortColumn = '',
    sortDesc = false
) =>
    useQuery({
        queryKey: ['categories', page, pageSize, search, sortColumn, sortDesc],
        queryFn: async (): Promise<{ data: Category[]; last_page: number }> => {
            return await getCategories(page, pageSize, search, sortColumn, sortDesc);
        },
    });

export const useShowCategory = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await showCategory(id);
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

export const useCreateCategory = () => {
    return useMutation({
        mutationFn: async (inputs: Category) => {
            return await createCategory(inputs);
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

export const useUpdateCategory = () => {
    return useMutation({
        mutationFn: async ({ id, categoryData }: { id: number; categoryData: Category }) => {
            return await updateCategory(id, categoryData);
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

export const useDeleteCategory = () => {
    return useMutation({
        mutationFn: async (id: number) => {
            return await deleteCategory(id);
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

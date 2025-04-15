import React, { FC, useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useCreateCategory, useUpdateCategory } from '@/lib/CategoryAPI';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Category } from '@/types/Category';
import { zodResolver } from '@hookform/resolvers/zod';

const categorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: 'Name is required' }),
    group: z.string().min(1, { message: 'Group is required' }),
});

export type CategoryInput = z.infer<typeof categorySchema>;

interface AppCategoryFormProps {
    data?: Category;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppCategoryForm: FC<AppCategoryFormProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [loading, setLoading] = useState(false);


    const form = useForm<CategoryInput>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            id: data?.id,
            name: data?.name || '',
            group: data?.group || '',
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name,
                group: data.group,
            });
        }
    }, [data, form]);

    const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

    const onSubmit = async (formData: CategoryInput) => {
        setLoading(true);

        if (data && data.id) {
            await updateCategory(
                { id: data.id, categoryData: formData },
                {
                    onSettled: () => {
                        onClose();
                        queryClient.invalidateQueries({ queryKey: ['categories'] });
                    },
                }
            );
        } else {
            await createCategory(formData, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['categories'] });
                },
            });
        }
        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{data ? 'Edit Category' : 'Add Category'}</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='group'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='mt-5 flex space-x-2'>
                                <Button variant="outline" onClick={onClose}>Close</Button>
                                <Button type="submit" variant="default" className="text-white" disabled={isCreating || isUpdating}>
                                    {loading ? <AppSpinner /> : (data ? 'Save' : 'Add')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppCategoryForm;

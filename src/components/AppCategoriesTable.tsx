'use client';
import React, { useState } from 'react';
import {
    ColumnDef,
    PaginationState,
    SortingState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';
import AppTable from '@/components/AppTable';
import { ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { Category } from '@/types/Category';
import { useCategories, useDeleteCategory, useUpdateCategory } from '@/lib/CategoryAPI';
import AppConfirmationDialog from './AppConfirmationDialog';
import AppCategoryForm from './AppCategoryForm';
import { useQueryClient } from '@tanstack/react-query';

export default function AppCategoieTable() {
    const queryClient = useQueryClient();
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const { data, isLoading } = useCategories(
        pageIndex + 1,
        pageSize,
        searchKeyword,
        sorting.map((item) => item.id).join(','),
        Boolean(sorting.map((item) => item.desc).join(','))
    );

    const { mutate } = useDeleteCategory();
    const { mutate: updateCategory } = useUpdateCategory();

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsEditDialogOpen(true);
    };

    const handleDeleteCategory = (id: number) => {
        mutate(id, {
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['categories'] });
            }
        });
    };

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent font-bold'
                    onClick={() => column.toggleSorting()}
                >
                    Name
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.name,
            enableSorting: true,
        },
        {
            accessorKey: 'group',
            header: ({ column }) => (
                <Button
                    variant='ghost'
                    className='pl-0 text-left hover:!bg-transparent font-bold'
                    onClick={() => column.toggleSorting()}
                >
                    Group
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            ),
            cell: ({ row }) => row.original.group,
            enableSorting: true,
        },
        {
            id: 'actions',
            header: () => <div className='text-center'>Actions</div>,
            cell: ({ row }) => (
                <div className="flex justify-center items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type='button'
                                    variant="outline"
                                    className="mr-2"
                                    onClick={() => handleEditCategory(row.original)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <AppConfirmationDialog
                        title='Delete Category'
                        description={`Are you sure you want to delete the category "${row.original.name}"? This action cannot be undone.`}
                        buttonElem={
                            <Button className="text-white" variant="destructive" type='button'>
                                <Trash size={20} />
                            </Button>
                        }
                        handleDialogAction={() => handleDeleteCategory(row.original.id!)}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        }
    ];

    const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: data?.data ?? Array(10).fill({}),
        columns: isLoading
            ? columns.map((column) => ({ ...column, cell: () => <Skeleton className='h-12 w-full' /> }))
            : columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onGlobalFilterChange: setSearchKeyword,
        pageCount: data?.last_page ?? -1,
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        state: {
            sorting,
            pagination,
            globalFilter: searchKeyword,
        },
    });

    return (
        <div>
            <AppTable table={table} />
            {selectedCategory && (
                <AppCategoryForm
                    data={selectedCategory}
                    isOpen={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    queryClient={queryClient}
                />
            )}
        </div>
    );
}

"use client"
import React, { useState } from 'react';
import AppCategoriesTable from '@/components/AppCategoriesTable';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import AppCategoryForm from '@/components/AppCategoryForm';
import { useQueryClient } from '@tanstack/react-query';


const Page = () => {
    const queryClient = useQueryClient();
    const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Categories</h1>
                <Button className="px-6 py-3.5 text-base font-medium text-white" onClick={() => { setIsAddCategoryDialogOpen(true) }}>
                    <Plus className="mr-2" />Add Category
                </Button>
            </div>
            <AppCategoriesTable />
            {
                isAddCategoryDialogOpen && (
                    <AppCategoryForm
                        onClose={() => setIsAddCategoryDialogOpen(false)}
                        isOpen={isAddCategoryDialogOpen}
                        queryClient={queryClient}
                    />
                )
            }
        </>
    );
};

export default Page;

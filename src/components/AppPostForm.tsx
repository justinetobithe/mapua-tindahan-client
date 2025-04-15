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
import { useCreateItem, useUpdateItem } from '@/lib/ItemAPI';
import AppSpinner from './AppSpinner';
import { QueryClient } from '@tanstack/react-query';
import { Item } from '@/types/Item';
import { zodResolver } from '@hookform/resolvers/zod';
import AppInputFile from './AppInputFile';
import { FileUpload } from '@/types/FileUpload';
import { X, } from 'lucide-react';
import { api } from '@/lib/api';
import Select from 'react-select';
import User from '@/types/User';
import { Category } from '@/types/Category';
import { toast } from './ui/use-toast';

const conditionOptions = [
    { value: "new", label: "New" },
    { value: "used - like new", label: "Used - Like New" },
    { value: "used - good", label: "Used - Good" },
    { value: "used - fair", label: "Used - Fair" },
]

const itemSchema = z.object({
    id: z.number().optional(),
    category_id: z.number({ required_error: 'Category is required' }),
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().optional(),
    condition: z.string().min(1, { message: 'Condition is required' }),
    price: z
        .string()
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val), {
            message: 'Price must be a number',
        }),
    location: z.string().optional(),
    uploaded_files: z.array(
        z.object({
            id: z.number(),
            filename: z.string(),
            file: z.instanceof(File).optional(),
            created_at: z.string(),
        })
    ).optional(),
});

export type ItemInput = z.infer<typeof itemSchema>;

interface AppPostFormProps {
    data?: Item;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppPostForm: FC<AppPostFormProps> = ({ data, isOpen, onClose, queryClient }) => {

    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FileUpload[]>([]);
    const [currentFiles, setCurrentFiles] = useState<FileUpload[]>([]);
    const [removedFileIds, setRemovedFileIds] = useState<number[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get<{ data: Category[] }>('/api/categories');
                setCategories(response.data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get<{ data: User }>('/api/me');
                setUser(data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    const form = useForm<ItemInput>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            id: data?.id,
            title: data?.title || '',
            description: data?.description || '',
            price: Number(data?.price) || 0,
            location: data?.location || '',
            category_id: data?.category_id || undefined,
            condition: data?.condition || '',
        },
    });


    useEffect(() => {
        if (isOpen) {
            setFiles([]);
            setCurrentFiles(data?.file_uploads ?? []);
            setRemovedFileIds([]);
            form.reset({
                id: data?.id,
                title: data?.title || '',
                description: data?.description || '',
                price: Number(data?.price) || 0,
                location: data?.location || '',
                category_id: data?.category_id || undefined,
                condition: data?.condition || '',
            });

        }
    }, [isOpen, data, form]);

    const handleFileChange = (selectedFiles: FileList) => {
        const filesArray = Array.from(selectedFiles).map((file, index) => {
            if (file.type.startsWith('image/')) {
                return {
                    id: index,
                    filename: file.name,
                    file: file,
                    created_at: new Date().toISOString(),
                    preview: URL.createObjectURL(file),
                };
            }
            return null;
        }).filter(file => file !== null) as FileUpload[];

        setFiles([...files, ...filesArray]);
    };

    const handleRemoveCurrentFile = (id: number) => {
        setCurrentFiles((prevFiles) => {
            const updatedFiles = prevFiles.filter(file => file.id !== id);
            setRemovedFileIds((prevIds) => [...prevIds, id]);
            return updatedFiles;
        });
    };

    const handleRemoveFile = (id: number) => {
        setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles.splice(id, 1);
            return updatedFiles;
        });
    };

    const { mutate: createItem, isPending: isCreating } = useCreateItem();
    const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();

    const onSubmit = async (formData: ItemInput) => {
        if (files.length === 0) {
            toast({
                variant: 'destructive',
                description: 'Please select at least one image.',
            });
            return;
        }

        const formattedData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            formattedData.append(key, value as string);
        });

        files.forEach((file, index) => {
            if (file.file) {
                formattedData.append(`uploaded_files[${index}]`, file.file);
            }
        });


        setLoading(true);

        if (data && data.id) {
            if (removedFileIds && removedFileIds.length > 0) {
                formattedData.append('current_files', JSON.stringify(removedFileIds));
            }

            formattedData.append('_method', 'PUT');

            await updateItem(
                { id: data.id, itemData: formattedData as Item },
                {
                    onSettled: () => {
                        onClose();
                        queryClient.invalidateQueries({ queryKey: ['items'] });
                    },
                }
            );
        } else {
            await createItem(formattedData as Item, {
                onSettled: () => {
                    onClose();
                    queryClient.invalidateQueries({ queryKey: ['items'] });
                },
            });
        }

        setLoading(false);
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className="!w-70">
                <AlertDialogHeader>
                    <AlertDialogTitle>{data ? 'Edit Post' : 'Add Post'}</AlertDialogTitle>
                </AlertDialogHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <textarea
                                                className='w-full border rounded-md p-2 text-sm'
                                                rows={4}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => {
                                    const selectedCategory = categories.find(c => c.id === field.value);
                                    return (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                defaultValue={
                                                    selectedCategory
                                                        ? { value: selectedCategory.id, label: `${selectedCategory.name} - ${selectedCategory.group}` }
                                                        : null
                                                }
                                                options={categories.map(c => ({
                                                    value: c.id,
                                                    label: `${c.name} - ${c.group}`,
                                                }))}
                                                onChange={(option) => field.onChange(option?.value)}
                                                isClearable
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type='number' step='0.01' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="condition"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Condition</FormLabel>
                                        <Controller
                                            control={form.control}
                                            name="condition"
                                            render={({ field }) => (
                                                <Select
                                                    value={conditionOptions.find(option => option.value === field.value) || null}
                                                    onChange={(option) => {
                                                        field.onChange(option?.value);
                                                    }}
                                                    options={conditionOptions}
                                                />
                                            )}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='location'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <AppInputFile
                                onChange={handleFileChange}
                                multiple={true}
                                name="item_files"
                            />

                            <div className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                    {files.map((file, index) => (
                                        file.preview && (
                                            <div key={`new-${index}`} className="relative w-20 h-20">
                                                <img
                                                    src={file.preview}
                                                    alt={file.filename}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                                                    onClick={() => handleRemoveFile(index)}
                                                    aria-label="Remove file"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )
                                    ))}

                                    {currentFiles.map((file, index) => (
                                        <div key={`current-${file.id}`} className="relative w-20 h-20">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL || ''}/storage/app/public/${file.path}`}
                                                alt={file.filename}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveCurrentFile(Number(file.id))}
                                                aria-label="Remove current file"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className='mt-5 flex space-x-2'>
                                <Button variant='outline' onClick={onClose}>Close</Button>
                                <Button type='submit' variant='default' className='text-white' disabled={isCreating || isUpdating}>
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

export default AppPostForm;
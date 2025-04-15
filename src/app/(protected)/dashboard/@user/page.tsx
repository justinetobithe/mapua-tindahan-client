"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader, Pencil } from "lucide-react";
import { useQueryClient } from '@tanstack/react-query';
import User from '@/types/User';
import { Item } from '@/types/Item';
import { api } from '@/lib/api';
import AppPostForm from '@/components/AppPostForm';
import { useUserItems } from '@/lib/ItemAPI';
import ItemImage from '/public/img/item.png';
import NoImage from '/public/img/no-image.png';
import Image from 'next/image';
import AppItemView from '@/components/AppItemView';

const Page = () => {
    const queryClient = useQueryClient();
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const { data, isLoading } = useUserItems(undefined, searchQuery);

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

    const handleCardClick = (item: Item) => {
        setSelectedItem(item);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Mapua Tindahan</h1>

                <div className="flex gap-2">
                    <Button onClick={() => setIsAddItemDialogOpen(true)}>
                        <Plus className="mr-2" /> Add Post
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader className="w-10 h-10 text-gray-400 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {data?.data?.length === 0 ? (
                        <div className="bg-white rounded shadow-sm overflow-hidden flex justify-center items-center h-36">
                            <Image
                                src={ItemImage.src}
                                alt="No items found"
                                width={200}
                                height={150}
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        data?.data?.map((item) => {
                            const firstFile = item.file_uploads?.[0];
                            const imageUrl = firstFile
                                ? `${process.env.NEXT_PUBLIC_API_URL || ''}/storage/${firstFile.path}`
                                : NoImage.src;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded shadow-sm overflow-hidden cursor-pointer"
                                    onClick={() => handleCardClick(item)} // Handle card click to show details
                                >
                                    <div className="relative w-full h-80">
                                        {user?.id && item?.added_by?.id && user.id === item.added_by.id && (
                                            <button
                                                className="absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-50 rounded-full text-white z-10">
                                                <Pencil size={20} />
                                            </button>
                                        )}

                                        <Image
                                            src={imageUrl}
                                            alt={item.title || 'Item'}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-t-md"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <h2 className="text-md font-semibold text-gray-800 line-clamp-2">{item.title}</h2>
                                        <p className="text-lg font-bold text-gray-700">₱{item.price?.toLocaleString() || '—'}</p>
                                        <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {isAddItemDialogOpen && (
                <AppPostForm
                    onClose={() => setIsAddItemDialogOpen(false)}
                    isOpen={isAddItemDialogOpen}
                    queryClient={queryClient}
                />
            )}

            {isEditItemDialogOpen && selectedItem && (
                <AppPostForm
                    data={selectedItem}
                    isOpen={isEditItemDialogOpen}
                    onClose={() => setIsEditItemDialogOpen(false)}
                    queryClient={queryClient}
                />
            )}

            {selectedItem && (
                <AppItemView
                    data={selectedItem}
                    isOpen={selectedItem !== null}
                    onClose={() => setSelectedItem(null)}
                    queryClient={queryClient}
                />
            )}
        </>
    );
};

export default Page;

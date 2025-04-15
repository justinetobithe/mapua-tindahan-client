import React, { FC, useState } from 'react';
import { ChevronRight, ChevronLeft, X, Mail } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Item } from '@/types/Item';
import Image from 'next/image';
import { QueryClient } from '@tanstack/react-query';

interface AppItemViewProps {
    data?: Item;
    isOpen: boolean;
    onClose: () => void;
    queryClient: QueryClient;
}

const AppItemView: FC<AppItemViewProps> = ({ data, isOpen, onClose, queryClient }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        if (data?.file_uploads?.length) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.file_uploads!.length);
        }
    };

    const handlePrevImage = () => {
        if (data?.file_uploads?.length) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + data.file_uploads!.length) % data.file_uploads!.length);
        }
    };

    const images = data?.file_uploads?.map((file) => `${process.env.NEXT_PUBLIC_API_URL || ''}/storage/app/public/${file.path}`) || [];

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="!w-full !min-w-full"> 
                <AlertDialogHeader>
                    <div className="flex justify-between items-center">
                        <AlertDialogTitle>{'View Item: ' + data?.title}</AlertDialogTitle>
                        <button onClick={onClose} className="text-gray-600 p-2 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                </AlertDialogHeader>

                <div className="flex">
                    <div className="w-1/2 flex justify-center items-center">
                        <div className="relative w-full h-80 overflow-hidden">
                            <div className="transition-transform duration-500 ease-in-out">
                                <Image
                                    src={images[currentImageIndex] || '/public/img/no-image.png'}
                                    alt={data?.title || 'Item'}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4">
                                    <button onClick={handlePrevImage} className="bg-gray-800 bg-opacity-50 text-white p-2 rounded-full">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={handleNextImage} className="bg-gray-800 bg-opacity-50 text-white p-2 rounded-full">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-1/2 p-4">
                        <h3 className="text-lg font-semibold text-gray-800">Details</h3>
                        <p className="text-sm text-gray-600 mt-2">{data?.description}</p>
                        <p className="mt-4 text-lg font-bold text-gray-700">₱{data?.price?.toLocaleString() || '—'}</p>
                        <p className="text-xs text-gray-500 mt-1">{data?.location}</p>

                        <div className="mt-4">
                            <h4 className="text-md font-semibold text-gray-800">Contact</h4>
                            <p className="text-sm text-gray-600">{data?.added_by?.first_name} {data?.added_by?.last_name}</p>
                            <p className="text-sm text-gray-600">{data?.added_by?.phone}</p>
                        </div>

                        <div className="mt-6">
                            <a href="/messages" className="flex items-center text-blue-600">
                                <Mail size={20} className="mr-2" /> Message Seller
                            </a>
                        </div>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AppItemView;

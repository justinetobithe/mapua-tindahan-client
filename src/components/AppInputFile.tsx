import React from 'react';
import { toast } from './ui/use-toast';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Input } from './ui/input';

interface AppInputFileProps {
    onChange: (files: FileList) => void;
    multiple?: boolean;
    name?: string;
}

const AppInputFile: React.FC<AppInputFileProps> = ({ onChange, multiple, name }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = e.target.files;

            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            const validFiles = Array.from(files).filter(file =>
                allowedTypes.includes(file.type)
            );

            if (validFiles.length !== files.length) {
                toast({
                    title: 'Invalid File Type',
                    description: 'Only JPG, JPEG, and PNG image files are allowed.',
                    variant: 'destructive',
                    duration: 3000,
                });
                return;
            }

            onChange(files);
            e.target.value = '';
        }
    };

    return (
        <FormItem>
            <label
                htmlFor={`custom-file-input-${name}`}
                className="w-full inline-block cursor-pointer bg-primary text-white py-2 px-4 rounded-lg shadow hover:bg-primary transition duration-200 text-sm font-medium text-center"
            >
                Upload Image
            </label>
            <FormControl>
                <div>
                    <Input
                        id={`custom-file-input-${name}`}
                        name={`custom-file-input-${name}`}
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        multiple={multiple}
                    />
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

export default AppInputFile;

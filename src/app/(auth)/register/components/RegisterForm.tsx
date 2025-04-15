'use client';
import React, { FC, useRef, useState } from 'react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useRegister } from '@/lib/AuthenticationAPI';
import AppSpinner from '@/components/AppSpinner';
import { strings } from '@/utils/strings';
import { Checkbox } from "@/components/ui/checkbox"
import AppConfirmationDialog from '@/components/AppConfirmationDialog';
import { convertBtoMb } from '@/utils/convertBtoMb';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/utils/constants';
import { X, Upload, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';


const inputSchema = z.object({
    first_name: z.string().min(3, strings.validation.required),
    last_name: z.string().min(3, strings.validation.required),
    email: z.string().email(),
    phone: z.string(),
    password: z
        .string({
            required_error: strings.validation.required,
            invalid_type_error: strings.validation.required,
        })
        .min(6, {
            message: strings.validation.password_min_characters,
        })
        .optional()
        .transform((v) => (typeof v === 'undefined' ? '' : v)),
    confirm_password: z
        .string({
            required_error: strings.validation.required,
            invalid_type_error: strings.validation.required,
        })
        .min(6, {
            message: strings.validation.password_min_characters,
        })
        .optional()
        .transform((v) => (typeof v === 'undefined' ? '' : v)),
    role: z.string().optional(),
});

export type RegisterInputs = z.infer<typeof inputSchema>;

const RegisterForm: FC = () => {
    const form = useForm<RegisterInputs>({
        resolver: zodResolver(inputSchema),
        defaultValues: { role: 'user' },
    });

    const [privacyChecked, setPrivacyChecked] = useState(false);
    const { mutate, isPending } = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (inputs: RegisterInputs) => {
        if (!privacyChecked) return;
        mutate({ inputs });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='lg:mx-initial mx-auto w-full space-y-8 rounded-lg bg-white p-16 text-secondary-foreground md:max-w-xl lg:mx-0'>
                <h4 className='text-center text-2xl font-bold'>Create your account</h4>
                <div className="grid grid-cols-1 gap-4">
                    <FormField control={form.control} name='first_name' render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-medium'>First Name</FormLabel>
                            <FormControl>
                                <Input type='text' {...field} className='border-black focus-visible:ring-offset-0' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name='last_name' render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-medium'>Last Name</FormLabel>
                            <FormControl>
                                <Input type='text' {...field} className='border-black focus-visible:ring-offset-0' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name='email' render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-medium'>Email Address</FormLabel>
                            <FormControl>
                                <Input type='email' {...field} className='border-black focus-visible:ring-offset-0' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name='phone' render={({ field }) => (
                        <FormItem>
                            <FormLabel className='font-medium'>Contact Number</FormLabel>
                            <FormControl>
                                <Input type='text' {...field} className='border-black focus-visible:ring-offset-0' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name='password' render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center justify-between'>
                                <FormLabel>Password</FormLabel>
                            </div>
                            <FormControl>
                                <div className='relative'>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        {...field}
                                        className='border-black focus-visible:ring-offset-0'
                                    />
                                    <button
                                        type='button'
                                        className='absolute inset-y-0 right-4 flex items-center'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name='confirm_password' render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center justify-between'>
                                <FormLabel>Confirm Password</FormLabel>
                            </div>
                            <FormControl>
                                <div className='relative'>
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...field}
                                        className='border-black focus-visible:ring-offset-0'
                                    />
                                    <button
                                        type='button'
                                        className='absolute inset-y-0 right-4 flex items-center'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <div className='flex items-center space-x-2'>
                    <Checkbox
                        id='privacy'
                        checked={privacyChecked}
                        onCheckedChange={(checked) => setPrivacyChecked(checked === true)}
                    />

                    <AppConfirmationDialog
                        title="Privacy Policy"
                        description={String(
                            <div className="text-sm leading-relaxed text-justify space-y-2">
                                <p>
                                    By signing up, you acknowledge and agree to our Privacy Policy. We collect and process your
                                    personal information to provide you with access to our services, improve your user experience,
                                    and comply with legal obligations.
                                </p>
                                <p>
                                    Your data may be used for account management, customer support, and personalized communications.
                                    We do not share your personal information with third parties without your consent, except as
                                    required by law or for necessary service provisions.
                                </p>
                                <p>
                                    You have the right to access, update, and delete your data at any time. For more details, please
                                    review our full Privacy Policy.
                                </p>
                            </div>
                        )}
                        buttonElem={
                            <label htmlFor="privacy" className="text-sm cursor-pointer text-blue-600 underline">
                                I agree to the Privacy Policy.
                            </label>
                        }
                    />
                </div>

                <Button type='submit' variant='default' className='block w-full font-semibold' disabled={isPending}>
                    {isPending ? <AppSpinner className='mx-auto' /> : 'Sign Up'}
                </Button>
            </form>
        </Form >
    );
};

export default RegisterForm;

'use client';
import React, { FC, useState } from 'react';
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
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import AppSpinner from '@/components/AppSpinner';

const inputSchema = z.object({
  email: z.string().email().min(3, {
    message: 'This field is required',
  }),
  password: z.string().min(3, {
    message: 'This field is required',
  }),
});

type Inputs = z.infer<typeof inputSchema>;

const LoginCard: FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<Inputs>({
    resolver: zodResolver(inputSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (inputs: Inputs) => {
    setLoading(true);
    // LOGIN USER
    const response = await signIn('credentials', {
      ...inputs,
      redirect: false,
    });

    if (response?.error) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: response.error,
        variant: 'destructive',
      });
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='lg:mx-initial mx-auto w-full space-y-8 rounded-lg bg-white p-16 text-secondary-foreground md:max-w-xl lg:mx-0'
      >
        <h4 className='text-2xl font-bold'>Login</h4>
        <FormField
          control={form.control}
          name='email'
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  {...field}
                  className='border-border focus-visible:ring-offset-0'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  {...field}
                  className='border-border focus-visible:ring-offset-0'
                />
              </FormControl>
              <FormDescription>
                <Link href='/'>Forgot password?</Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='block w-full bg-primary-500 bg-gradient-to-l bg-gradient-to-r from-primary-300 to-primary-400 font-bold text-white'
          disabled={loading}
        >
          {loading ? <AppSpinner className='mx-auto' /> : 'Login'}
        </Button>
      </form>
    </Form>
  );
};

export default LoginCard;

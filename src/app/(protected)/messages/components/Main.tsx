'use client';
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppDebouncedInput from '@/components/AppDebouncedInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import moment from 'moment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getMessages, useSendMessage } from '@/lib/MessageAPI';
import { useUsers } from '@/lib/UsersAPI';
import { strings } from '@/utils/strings';
import log from '@/utils/logger';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Message } from '@/types/Message';
import User from '@/types/User';
import { cn } from '@/utils/cn';

const inputSchema = z.object({
  content: z.string().min(1, { message: strings.validation.required }),
});

export type MessageInputs = z.infer<typeof inputSchema>;

const Main = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const { data: users } = useUsers(1, 100, searchKeyword, '', false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const queryClient = useQueryClient();
  const { mutate: sendMessage, isPending } = useSendMessage();
  const session = useSession();

  const form = useForm<MessageInputs>({
    resolver: zodResolver(inputSchema),
    defaultValues: { content: '' },
  });

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        const msgs = await getMessages(selectedUser.id!.toString());
        setMessages(msgs);
        setTimeout(() => {
          messageListRef.current?.scrollIntoView({ behavior: 'instant' });
        }, 500);
      };
      fetchMessages();
    }
    return () => setMessages([]);
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser && session.data && !isInitialized) {
      setIsInitialized(true);
      const apiKey = process.env.NEXT_PUBLIC_PUSHER_API_KEY!;
      const echo = new Echo({
        broadcaster: 'pusher',
        key: apiKey,
        client: new Pusher(apiKey, {
          cluster: 'ap1',
          forceTLS: true,
        }),
      });

      echo.channel('chat').listen('MessageSent', (data: { message: Message }) => {
        const userId = session.data?.user.id.toString();
        if (
          data.message.sender_id.toString() === userId ||
          data.message.recipient_id.toString() === userId
        ) {
          setMessages((prev) => [...prev, data.message]);
          setTimeout(() => {
            messageListRef.current?.scrollIntoView({ behavior: 'instant' });
          }, 300);
        }
      });
    }
  }, [selectedUser, session, isInitialized]);

  const onSubmit = (data: MessageInputs) => {
    if (!selectedUser) return;

    sendMessage(
      { recipient_id: selectedUser.id!.toString(), data },
      {
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['messages'] });
          form.reset({ content: '' });
        },
      }
    );
  };

  const handleSelectChatItem = (user: User) => {
    setSelectedUser(user);
  };


  return (
    <div className="flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-300">
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-primary text-white">
          <h1 className="text-2xl font-semibold">Chat</h1>
        </header>

        <div className="overflow-y-auto max-h-[800px] p-3 mb-9 pb-20">
          {users?.data
            ?.filter((item) => item.id !== session.data?.user.id)
            .map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md',
                  { 'bg-gray-100': item.id === selectedUser?.id }
                )}
                onClick={() => handleSelectChatItem(item)}
              >
                <Avatar className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                  <AvatarImage src={item.image ?? ''} />
                  <AvatarFallback>
                    {item.first_name.charAt(0).toUpperCase()}
                    {item.last_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {item.first_name} {item.last_name}
                  </h2>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedUser && (
        <div className="flex-1 relative">
          <header className="bg-white p-4 text-gray-700">
            <h1 className="text-2xl font-semibold">
              {selectedUser.first_name} {selectedUser.last_name}
            </h1>
          </header>

          {/* Chat Messages */}
          <div className="max-h-[500px] overflow-y-auto p-4">
            {messages.map((item) => (
              <Fragment key={item.id}>
                {item.sender_id.toString() === session.data?.user.id ? (
                  <div className="flex justify-end mb-4 cursor-pointer">
                    <div>
                      <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                        <p>{item.content}</p>
                      </div>
                      <p className="text-xs">{moment(item.created_at).fromNow()}</p>
                    </div>
                    <Avatar className="w-9 h-9 rounded-full ml-2">
                      <AvatarImage src={session.data?.user.image ?? ''} />
                      <AvatarFallback>
                        {session.data?.user.first_name?.charAt(0).toUpperCase()}
                        {session.data?.user.last_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div
                    className={`flex mb-4 cursor-pointer items-center ${item.recipient_id.toString() != session.data?.user.id
                      ? 'justify-end'
                      : 'justify-start'
                      }`}
                  >
                    <Avatar className="w-9 h-9 rounded-full mr-2">
                      <AvatarImage src={selectedUser.image ?? ''} />
                      <AvatarFallback>
                        {item.recipient_id.toString() != session.data?.user.id
                          ? `${selectedUser.first_name?.charAt(0).toUpperCase() ?? ''}${selectedUser.last_name?.charAt(0).toUpperCase() ?? ''}`
                          : `${item.recipient?.first_name?.charAt(0).toUpperCase() ?? ''}${item.recipient?.last_name?.charAt(0).toUpperCase() ?? ''}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                        <p className="text-gray-700">{item.content}</p>
                      </div>
                      <p className="text-xs text-gray-700">
                        {moment(item.created_at).fromNow()}
                      </p>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
            <div ref={messageListRef}></div>
          </div>

          {/* Chat Input */}
          <footer className="bg-white border-t border-gray-300 p-4 w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Type a message..."
                          className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
                  disabled={isPending}
                >
                  Send
                </button>
              </form>
            </Form>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Main;

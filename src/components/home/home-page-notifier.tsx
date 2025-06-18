
"use client";

import type React from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import NotificationToast from '@/components/shared/notification-toast';
import type { NotificationConfig } from '@/lib/notification-data';

interface HomePageNotifierProps {
  notificationConfig: NotificationConfig | null;
}

export default function HomePageNotifier({ notificationConfig }: HomePageNotifierProps) {
  return (
    <>
      <NotificationToast notificationConfig={notificationConfig} />
      <SonnerToaster
        className="z-40"
        position="bottom-center"
        richColors
        closeButton={true}
        toastOptions={{
          classNames: {
            toast: 'font-headline w-full max-w-[calc(100vw-1rem)] sm:max-w-xl bg-background/85 backdrop-blur-sm border mb-[75px] sm:mb-0',
            description: 'text-sm xs:text-base',
          },
        }}
      />
    </>
  );
}

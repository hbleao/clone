'use client';
import { queryClient } from '@/lib';
import { QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { CookiesProvider } from 'react-cookie';

type LayoutProviderProps = {
	children: React.ReactNode;
};

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
	return (
		<CookiesProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</CookiesProvider>
	);
};

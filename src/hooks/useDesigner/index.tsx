'use client';
import { DesignerContext } from '@/context';
import { useContext } from 'react';

export const useDesigner = () => {
	const context = useContext(DesignerContext);

	if (!context)
		throw new Error('UseDesigner must be used within a DesignContext');

	return context;
};

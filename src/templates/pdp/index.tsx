'use client';
import React, { useEffect } from 'react';

import './styles.scss';

import { DynamicSectionComponent } from '../sectionList';
import { configAcquisitionSteps } from './configPage';

import { usePageStore, useUserStore } from '@/store';

import {
	SectionFooter,
	SectionHeader,
	UnregisteredSession,
} from '@/components';

import { joinClasses } from '@porto-ocean/utils';
import type { TemplatePdpProps } from './types';

export const TemplatePdp = ({
	className = '',
	layout,
	sections,
	sku = '',
	price,
}: TemplatePdpProps) => {
	const cleanUserData = useUserStore((state) => state.cleanUserData);
	const saveConfigPage = usePageStore((state) => state.saveConfigPage);
	const setProductUser = useUserStore((state) => state.setProductUser);

	useEffect(() => {
		cleanUserData();
		setProductUser({
			alias: sku,
			cardPrice: {
				price,
			},
		});
		saveConfigPage(configAcquisitionSteps[sku]);
	}, []);

	return (
		<>
			<SectionHeader {...layout.header} />
			<main className={joinClasses(['template-pdp', className])}>
				{sections?.map((section) => (
					<React.Fragment key={section?.name}>
						{DynamicSectionComponent[section?.name] ? (
							<>{DynamicSectionComponent[section?.name](section.component)}</>
						) : (
							<UnregisteredSession sectionName={section?.name} />
						)}
					</React.Fragment>
				))}
			</main>
			<SectionFooter {...layout.footer} />
		</>
	);
};

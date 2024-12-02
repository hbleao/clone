import React from 'react';

import { DynamicSectionComponent } from '../sectionList';

import {
	SectionFooter,
	SectionHeader,
	UnregisteredSession,
} from '@/components';
import { DialogError } from '@/components/DialogError';

import type { DefaultTemplateProps } from './types';

export const DefaultTemplate = ({
	className,
	sections,
	layout,
}: DefaultTemplateProps) => {
	return (
		<>
			<DialogError />
			<SectionHeader {...layout.header} />
			<main className={className}>
				{sections.length > 0 &&
					sections.map((section, idx) => (
						<React.Fragment key={`${section.name}-${idx}`}>
							{DynamicSectionComponent[section.name] ? (
								<>{DynamicSectionComponent[section.name](section.component)}</>
							) : (
								<UnregisteredSession sectionName={section.name} />
							)}
						</React.Fragment>
					))}
			</main>
			<SectionFooter {...layout.footer} />
		</>
	);
};

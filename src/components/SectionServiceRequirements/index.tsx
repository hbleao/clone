'use client';

import './styles.scss';

import * as CardIcon from '@porto-ocean/card-icon';
import { Grid } from '@porto-ocean/grid';
import * as Modal from '@porto-ocean/modal';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';
import { Fragment, useState } from 'react';

import { CustomIcons } from '@/constants';
import { formatGtm } from '@/utils';
import { Icon } from '@porto-ocean/icon';
import { joinClasses } from '@porto-ocean/utils';
import type {
	SectionServiceRequirementsProps,
	ServiceRequirements,
} from './types';

export const SectionServiceRequirements = ({
	title,
	requirements,
	variant = 'default',
}: SectionServiceRequirementsProps) => {
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [currentModalContent, setCurrentModalContent] =
		useState<ServiceRequirements | null>(null);

	return (
		<section
			className={joinClasses([
				'section-service-requirements',
				`--${variant}`,
				'margin-default',
			])}
		>
			<Grid className="service-requirements">
				<Row className="service-requirements__row">
					<Typography
						className="service-requirements__title"
						variant="title4"
						as="h3"
					>
						{title}
					</Typography>
					<div className="service-requirements__card-container">
						{requirements.map((card, index) => {
							const isDetailsEmpty =
								!card.details || Object.keys(card.details).length === 0;

							return (
								<Fragment key={card.title}>
									<CardIcon.Root
										className={joinClasses([
											'service-requirements__card',
											isDetailsEmpty ? 'no-pointer' : 'has-pointer',
										])}
										onClick={() => {
											if (!isDetailsEmpty) {
												setCurrentModalContent(card);
												setIsOpenModal(true);
											}
										}}
										data-gtm-type="click"
										data-gtm-clicktype="card-icon-self"
										data-gtm-name={`${formatGtm(title)}`}
										data-gtm-subname={`${formatGtm(card.title)}:${index + 1}`}
									>
										<CustomIcons iconName={card.icon} size="text-6xl" />
										<CardIcon.Title>{card.title}</CardIcon.Title>
										<CardIcon.Pretitle>{card.caption}</CardIcon.Pretitle>
									</CardIcon.Root>
									{isOpenModal && (
										<>
											<Modal.Root>
												<Modal.Header>
													<Modal.ContentIconClose
														onClick={() => setIsOpenModal(false)}
													>
														<Icon iconName="icon-porto-ic-close1" />
													</Modal.ContentIconClose>
												</Modal.Header>
												<Modal.Body>
													<Modal.Content className="service-requirements__modal-content">
														<div className="service-requirements__content-container">
															<Typography variant="title4">
																{currentModalContent?.title}
															</Typography>
															<div
																dangerouslySetInnerHTML={{
																	__html: currentModalContent?.details.content!,
																}}
															/>
														</div>

														{currentModalContent?.details?.notification && (
															<CardIcon.Root className="service-requirements__notification">
																<CustomIcons
																	iconName={
																		currentModalContent.details.notification
																			.icon
																	}
																/>
																<div className="wrapper">
																	<CardIcon.Title>
																		{
																			currentModalContent.details.notification
																				.title
																		}
																	</CardIcon.Title>
																	<CardIcon.Description>
																		{
																			currentModalContent.details.notification
																				.description
																		}
																	</CardIcon.Description>
																</div>
															</CardIcon.Root>
														)}
													</Modal.Content>
												</Modal.Body>
											</Modal.Root>
											<Modal.Overlay />
										</>
									)}
								</Fragment>
							);
						})}
					</div>
				</Row>
			</Grid>
		</section>
	);
};

'use client';
import { Button } from '@porto-ocean/button';
import { Icon } from '@porto-ocean/icon';
import * as Modal from '@porto-ocean/modal';
import * as Notification from '@porto-ocean/notification';
import { Typography } from '@porto-ocean/typography';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import './styles.scss';

import { Radio } from '@/components';

import type { ModalReminderListProps } from './types';

export const ModalReminderList = ({
	title,
	subtitle,
	reminderList = [],
	refusedOption,
	dispatch,
	isEnableButton,
	onNextStep,
	isLoading,
}: ModalReminderListProps) => {
	const router = useRouter();

	return (
		<>
			<Modal.Overlay />
			<Modal.Root className="modal-reminder-list">
				<Modal.Content>
					<Modal.Header>
						<Modal.ContentIconClose
							onClick={() =>
								dispatch({ type: 'setIsOpenModal', payload: false })
							}
						>
							<Icon size="text-md" iconName="icon-porto-ic-close" />
						</Modal.ContentIconClose>
						<div className="reminder-list__header">
							<Modal.ContentTitle>{title}</Modal.ContentTitle>

							<Typography as="h5" variant="body2" color="black100">
								{subtitle}
							</Typography>
						</div>
					</Modal.Header>
					<Modal.Body>
						{reminderList.map((reminder) => (
							<Notification.Root
								key={reminder.title}
								variant={reminder.refused ? 'attention' : 'outlined'}
								className="modal-reminder-list__notification"
							>
								<Image
									className="modal-reminder-list__reminder-image"
									src={reminder.iconName}
									alt="icon"
									width={24}
									height={24}
								/>
								<Notification.Content>
									<Notification.Title>{reminder.title}</Notification.Title>
									<div
										className="typography --body2 --color-black100 --font-style-normal notification__description"
										dangerouslySetInnerHTML={{ __html: reminder.description }}
									/>
									<div className="modal-reminder-list__reminder-options">
										<Radio.Root
											variant={reminder.accepted ? 'checked' : 'default'}
											onClick={() =>
												dispatch({
													type: 'setSelectedReminder',
													payload: {
														option: reminder,
														inputType: 'acceptedLabel',
													},
												})
											}
										>
											<Radio.Input />
											<Radio.Label
												variant="body2"
												color={
													reminder.accepted ? 'portoSeguros100' : 'black75'
												}
											>
												{reminder.acceptLabel}
											</Radio.Label>
										</Radio.Root>
										{!!reminder.refuseLabel && (
											<Radio.Root
												className={reminder.refused ? '--refused' : ''}
												variant={reminder.refused ? 'checked' : 'default'}
												onClick={() =>
													dispatch({
														type: 'setSelectedReminder',
														payload: {
															option: reminder,
															inputType: 'refusedLabel',
														},
													})
												}
											>
												<Radio.Input />
												<Radio.Label
													variant="body2"
													color={reminder.refused ? 'red100' : 'black75'}
												>
													{reminder.refuseLabel}
												</Radio.Label>
											</Radio.Root>
										)}
									</div>
								</Notification.Content>
							</Notification.Root>
						))}

						{refusedOption && (
							<Notification.Root
								variant="error"
								className="modal-reminder-list__notification-refused"
							>
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clipPath="url(#clip0_11579_2249)">
										<path
											d="M23.7399 20.1405L13.8599 1.8605C13.4799 1.1605 12.7799 0.760498 11.9999 0.760498C11.2199 0.760498 10.5199 1.1805 10.1399 1.8605L0.259909 20.1405C-0.100091 20.8005 -0.0800909 21.5805 0.299909 22.2205C0.679909 22.8605 1.35991 23.2605 2.11991 23.2605H21.8799C22.6399 23.2605 23.3199 22.8805 23.6999 22.2205C24.0799 21.5805 24.0999 20.8005 23.7399 20.1405ZM22.8399 21.7205C22.6399 22.0605 22.2799 22.2605 21.8799 22.2605H2.11991C1.71991 22.2605 1.35991 22.0605 1.15991 21.7205C0.959909 21.3805 0.939909 20.9605 1.13991 20.6205L11.0199 2.3405C11.2199 1.9805 11.5799 1.7605 11.9999 1.7605C12.4199 1.7605 12.7799 1.9805 12.9799 2.3405L22.8599 20.6205C23.0399 20.9605 23.0399 21.3805 22.8399 21.7205Z"
											fill="#842310"
										/>
										<path
											d="M11.9999 17.1605C12.2799 17.1605 12.4999 16.9405 12.4999 16.6605V8.6205C12.4999 8.3405 12.2799 8.1205 11.9999 8.1205C11.7199 8.1205 11.4999 8.3405 11.4999 8.6205V16.6605C11.4999 16.9405 11.7199 17.1605 11.9999 17.1605Z"
											fill="#842310"
										/>
										<path
											d="M11.9999 18.6205C11.5799 18.6205 11.2399 18.9605 11.2399 19.3605C11.2399 19.7605 11.5799 20.1205 11.9999 20.1205C12.4199 20.1205 12.7599 19.7805 12.7599 19.3605C12.7599 18.9405 12.4199 18.6205 11.9999 18.6205Z"
											fill="#842310"
										/>
									</g>
									<defs>
										<clipPath id="clip0_11579_2249">
											<rect width="24" height="24" fill="white" />
										</clipPath>
									</defs>
								</svg>

								<Notification.Content>
									<Notification.Title>
										Não podemos prosseguir
									</Notification.Title>
									<Notification.Description>
										O aceite em todos os itens é fundamental para o agendamento
										do serviço. Se tiver alguma dúvida, converse com a gente.
									</Notification.Description>
								</Notification.Content>
								<div className="modal-reminder-list__notification-refused-buttons">
									<Button
										variant="danger"
										styles="ghost"
										size="small"
										onClick={() =>
											router.push(
												'https://prime.altubots.com/chats/portoassistencia/e67490dac9a657589b41411700ce378c/index.html',
											)
										}
									>
										Ir para o chat
									</Button>
								</div>
							</Notification.Root>
						)}
						<Button
							width="fluid"
							variant={isEnableButton || isLoading ? 'insurance' : 'disabled'}
							styles="primary"
							onClick={() => onNextStep()}
							isLoading={isLoading}
							disabled={!isEnableButton || isLoading}
						>
							Continuar
						</Button>
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
		</>
	);
};

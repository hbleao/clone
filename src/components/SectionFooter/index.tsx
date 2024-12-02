'use client';
import { Button } from '@porto-ocean/button';
import * as Footer from '@porto-ocean/footer';
import { Icon } from '@porto-ocean/icon';
import * as Modal from '@porto-ocean/modal';
import Image from 'next/image';
import React, { useState } from 'react';

import { formatAemImageUrl, formatGtm } from '@/utils';

import './styles.scss';

import type { Links, SectionFooterProps } from './types';

export const SectionFooter = ({
	titleModal,
	gtmName,
	titleQuickLinks,
	quickLinks,
	titleAboutUs,
	aboutUs,
	titleSocialMedia,
	socialMedia,
	titleAppStore,
	buttonsAppStore,
	buttonText,
	bottomLinks,
	buttonsModal,
}: SectionFooterProps) => {
	const [isOpenQuickLinks, setIsOpenQuickLinks] = useState<boolean>(false);
	const [isOpenAboutUs, setIsOpenAboutUs] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState(false);

	function toggleQuickLinks() {
		setIsOpenQuickLinks((oldState) => !oldState);
	}

	function toggleAboutUs() {
		setIsOpenAboutUs((oldState) => !oldState);
	}

	function handleOpenModal() {
		setIsOpen(true);
	}

	function handleCloseModal() {
		setIsOpen(false);
	}

	function handleRedirect(button: Links) {
		if (typeof window === 'undefined') return;
		window.open(button.url, button.target);
	}

	return (
		<Footer.Root className="section-footer">
			<Footer.Column
				mobile={[1, 9]}
				portrait={[1, 4]}
				landscape={[1, 4]}
				desktop={[1, 4]}
				wide={[1, 4]}
			>
				<Footer.Trigger onClick={toggleQuickLinks}>
					<Footer.TitleTrigger>{titleQuickLinks}</Footer.TitleTrigger>
					<Footer.IconTrigger isOpen={isOpenQuickLinks}>
						<Icon
							iconName="icon-porto-ic-short-arrow-down"
							size="text-md"
							color="white"
						/>
					</Footer.IconTrigger>
				</Footer.Trigger>

				<Footer.List isOpen={isOpenQuickLinks}>
					{quickLinks?.map((link) => (
						<Footer.BottomLink
							href={link.url}
							target="_blank"
							key={link.name}
							rel="noreferrer"
						>
							<Footer.ListItem>
								{link?.icon && (
									<Footer.ListIcon>
										<Icon iconName={link.icon} size="text-md" color="white" />
									</Footer.ListIcon>
								)}
								<Footer.ListLink
									data-gtm-type="click"
									data-gtm-clicktype="footer"
									data-gtm-name={titleQuickLinks}
									data-gtm-subname={link.name!}
								>
									{link.name}
								</Footer.ListLink>
							</Footer.ListItem>
						</Footer.BottomLink>
					))}
				</Footer.List>
			</Footer.Column>

			<Footer.Column
				mobile={[1, 9]}
				portrait={[4, 7]}
				landscape={[5, 8]}
				desktop={[4, 7]}
				wide={[4, 7]}
			>
				<Footer.Trigger onClick={toggleAboutUs}>
					<Footer.TitleTrigger>{titleAboutUs}</Footer.TitleTrigger>
					<Footer.IconTrigger isOpen={isOpenAboutUs}>
						<Icon
							iconName="icon-porto-ic-short-arrow-down"
							size="text-md"
							color="white"
						/>
					</Footer.IconTrigger>
				</Footer.Trigger>

				<Footer.List isOpen={isOpenAboutUs}>
					{aboutUs?.map((link) => (
						<Footer.BottomLink
							href={link.url}
							target="_blank"
							rel="no referrer"
							key={link.name}
						>
							<Footer.ListItem>
								{link?.icon && (
									<Footer.ListIcon>
										<Icon iconName={link.icon} size="text-sm" color="white" />
									</Footer.ListIcon>
								)}
								<Footer.ListLink
									data-gtm-type="click"
									data-gtm-clicktype="footer"
									data-gtm-name={titleAboutUs}
									data-gtm-subname={link.name!}
								>
									{link.name}
								</Footer.ListLink>
							</Footer.ListItem>
						</Footer.BottomLink>
					))}
				</Footer.List>
			</Footer.Column>

			<Footer.Column
				mobile={[1, 9]}
				portrait={[1, 5]}
				landscape={[1, 5]}
				desktop={[9, 13]}
				wide={[10, 13]}
			>
				<Icon iconName="icon-logo-porto" size="text-5xl" color="white" />
				<Footer.Brand>
					<Footer.BrandTitle>{titleSocialMedia}</Footer.BrandTitle>
					<Footer.BrandSocialLinks>
						{socialMedia?.map((social, i) => (
							<Footer.BrandSocialLink
								href={social.url}
								target="_blank"
								key={`${social.name}-${i}`}
							>
								<Icon iconName={social.icon!} size="text-2xl" color="white" />
							</Footer.BrandSocialLink>
						))}
					</Footer.BrandSocialLinks>
				</Footer.Brand>

				<Footer.BrandTitle>{titleAppStore}</Footer.BrandTitle>
				<Footer.Stores>
					{buttonsAppStore?.map((store) => (
						<Footer.Store
							key={store.name}
							href={store.url}
							target={store.target}
							data-gtm-name={titleAppStore}
							data-gtm-click="footer"
						>
							<Image
								src={formatAemImageUrl(store.icon!)}
								alt="loja de aplicativo"
								width={124}
								height={24}
							/>
						</Footer.Store>
					))}
				</Footer.Stores>

				<Footer.Partners>
					<Button
						styles="secondary"
						variant="negative"
						onClick={handleOpenModal}
						data-gtm-subname={buttonText}
						data-gtm-name={gtmName}
					>
						{buttonText}
					</Button>
				</Footer.Partners>

				{isOpen && (
					<>
						<Modal.Overlay />
						<Modal.Root>
							<Modal.Content>
								<Modal.Header>
									<Modal.ContentTitle>{titleModal}</Modal.ContentTitle>
									<Modal.ContentIconClose
										onClick={handleCloseModal}
										data-gtm-type="click"
										data-gtm-clicktype="button"
										data-gtm-name={`${titleModal}`}
										data-gtm-subname="fechar"
									>
										<Icon size="text-md" iconName="icon-porto-ic-close" />
									</Modal.ContentIconClose>
								</Modal.Header>

								<Modal.Body>
									<div className="section-footer__modal-buttons">
										{buttonsModal.map((button) => (
											<Button
												width="fluid"
												variant="insurance"
												styles="secondary"
												key={button.name}
												onClick={() => handleRedirect(button)}
											>
												{button.name}
											</Button>
										))}
									</div>
								</Modal.Body>
							</Modal.Content>
						</Modal.Root>
					</>
				)}
			</Footer.Column>

			<Footer.Column
				mobile={[1, 9]}
				portrait={[1, 9]}
				landscape={[1, 13]}
				desktop={[1, 13]}
				wide={[1, 13]}
			>
				<Footer.Line />
				<Footer.BottomList>
					{bottomLinks?.map((link) => (
						<Footer.BottomListItem key={link.name}>
							<Footer.BottomLink
								href={link.url}
								target={link.target}
								data-gtm-type="click"
								data-gtm-clicktype="footer"
								data-gtm-name="rodape"
								data-gtm-subname={formatGtm(link.name!)}
							>
								{link.name}
							</Footer.BottomLink>
						</Footer.BottomListItem>
					))}
					<Footer.BottomListItem>
						<p
							className="section-footer__cookies ps-subheading ps-color-white ps-md-pad--left ot-sdk-show-settings config-cookies"
							id="ot-sdk-btn"
							data-gtm-type="click"
							data-gtm-clicktype="footer"
							data-gtm-name="rodape"
							data-gtm-subname="configuracoes-de-cookies"
						>
							Configurações de Cookies
						</p>
					</Footer.BottomListItem>
				</Footer.BottomList>
			</Footer.Column>
		</Footer.Root>
	);
};

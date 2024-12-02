'use client';

import s from '../styles.module.scss';

import { Typography } from '@porto-ocean/typography';
import Image from 'next/image';

import IcCalendar from '@/assets/icons/ic-calendar.svg';
import IcCarFront from '@/assets/icons/ic-car-front.svg';
import IcCarShop from '@/assets/icons/ic-car-shop.svg';
import IcWrenchTool from '@/assets/icons/ic-wrench-tool.svg';
import { useUserStore } from '@/store';

export const ClientData = () => {
	const user = useUserStore((state) => state.user);

	const phoneWorkshop = `(${user?.workshopSelected?.areaCode}) ${user?.workshopSelected?.phone}`;

	return (
		<>
			<div className={s.service}>
				<Image src={IcWrenchTool} alt="" width={24} height={24} />
				<div className={s.title}>
					<Typography variant="body1" weight="bold" color="black85">
						Centro Automotivo Porto
					</Typography>
					<Typography variant="body1" weight="regular" color="black75">
						{user.product.categories?.subCategory || ''}
					</Typography>
				</div>
			</div>

			<div className={s.service}>
				<Image src={IcCarFront} alt="" width={24} height={24} />
				<div className={s.title}>
					<Typography variant="body1" weight="bold" color="black85">
						Veículo
					</Typography>
					<Typography variant="body1" weight="regular" color="black75">
						{user?.vehicle || ''}
					</Typography>
				</div>
			</div>

			<div className={s.service}>
				<Image src={IcCarShop} alt="" width={24} height={24} />
				<div className={s.title}>
					<Typography variant="body1" weight="bold" color="black85">
						Oficina {user?.workshopSelected?.name || ''}
					</Typography>
					<Typography variant="body1" weight="regular" color="black75">
						{user?.workshopSelected?.address} -
						{user?.workshopSelected?.district},{user?.workshopSelected?.zipCode}{' '}
						- {user?.workshopSelected?.city}/{user?.workshopSelected?.state}
					</Typography>
					<Typography variant="body1" weight="regular" color="black75">
						Tel.{' '}
						<a href={`tel:${phoneWorkshop.replace(/[^\d]/g, '')}`}>
							{phoneWorkshop}
						</a>
					</Typography>
					<Typography variant="body1" weight="regular" color="black75">
						<span>E-mail: </span>
						<a href={`mailto:${user?.workshopSelected?.email}`}>
							{user?.workshopSelected?.email}
						</a>
					</Typography>
				</div>
			</div>

			<div className={s.service}>
				<Image src={IcCalendar} alt="" width={24} height={24} />
				<div className={s.title}>
					<Typography variant="body1" weight="bold" color="black85">
						Data e período
					</Typography>
					<Typography variant="body1" weight="regular" color="black75">
						{user.appointment.serviceDateTime}
					</Typography>
				</div>
			</div>
		</>
	);
};

import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';
import Image from 'next/image';

import s from './styles.module.scss';

import IcCalendarRemove from '@/assets/icons/ic-calendar-remove.svg';
import IcCircleDollar from '@/assets/icons/ic-circle-dollar.svg';
import IcCircleOk from '@/assets/icons/ic-circle-ok.svg';
import { SectionFooter, SectionHeader } from '@/components';
import { AEMService } from '@/services';
import { ClientData } from './ClientData';

export default async function ConclusionPage() {
	const { sections } = await AEMService.getContent(
		'https://www.portoseguro.com.br/cartao-de-credito.model.json',
	);

	const layout = {
		header: sections[1].component,
		footer: sections[18].component,
	};

	return (
		<>
			<SectionHeader {...layout.header} />
			<Grid>
				<Row landscape={[3, 11]} desktop={[3, 11]} wide={[3, 11]}>
					<div className={s.container}>
						<div className={s.header}>
							<Image src={IcCircleOk} alt="" width={32} height={32} />
							<Typography variant="title4" weight="bold" color="black85">
								Agendamento concluído!
							</Typography>
						</div>
						<div className={s.header}>
							<Typography variant="title6" weight="semibold" color="black75">
								Agora é com a gente.
							</Typography>
							<Typography variant="body2" weight="regular" color="black75">
								A oficina já foi avisada, e enviamos as informações do seu
								agendamento para @email_cadastrado Caso precise, a oficina
								entrará em contato para saber mais sobre o serviço.
							</Typography>
						</div>

						<div className={s.infos}>
							<div className={s.services}>
								<ClientData />
							</div>
							<div className={s.actions}>
								<div className={s.cancel}>
									<Image src={IcCalendarRemove} alt="" width={24} height={24} />
									<div className={s.title}>
										<Typography variant="body1" weight="bold" color="black85">
											Para cancelar ou reagendar
										</Typography>
										<Typography
											variant="body1"
											weight="regular"
											color="black75"
										>
											Acesse a seção de atendimento na página do Centro
											Automotivo Porto, também enviamos as instruções por
											e-mail.
										</Typography>
									</div>
								</div>

								<div className={s.payment}>
									<Image src={IcCircleDollar} alt="" width={24} height={24} />
									<div className={s.title}>
										<Typography variant="body1" weight="bold" color="black85">
											Pagamento
										</Typography>
										<Typography
											variant="body1"
											weight="regular"
											color="black75"
										>
											O pagamento será feito no Centro Automotivo Porto após a
											realização do serviço.
										</Typography>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Row>
			</Grid>
			<SectionFooter {...layout.footer} />
		</>
	);
}

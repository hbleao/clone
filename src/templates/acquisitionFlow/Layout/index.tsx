'use client';
import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import Image from 'next/image';

import './styles.scss';

import { usePageStore } from '@/store';

import { HeaderStore, Link } from '@/components';
import * as Stepper from '@/components/Stepper';

import { getStepParam } from '@/utils';

import type { AcquisitionFlowProps } from './types';

export const AcquisitionFlowLayout = ({ children }: AcquisitionFlowProps) => {
	const page = usePageStore((state) => state.page);
	const step = getStepParam(page.steps);
	const stepIndex = step?.index as number;
	const nextLabel = page?.steps[stepIndex]?.nextLabe;
	const isNextStep = page?.steps[stepIndex + 1];
	const nextStepLabel = nextLabel ?? isNextStep?.label ?? 'Carrinho';

	const tagStep = {
		'0': {
			name: 'agendamento',
			subname: 'selecione-o-dia-e-horario',
		},
		'1': {
			name: 'local-do-servico',
			subname: 'confirme-onde-o-servico-sera-realizado',
		},
		'2': {
			name: 'dados-cadastrais',
			subname: 'informe-seus-dados',
		},
	};

	return (
		<section className="acquisition-flow">
			<Grid>
				<Row landscape={[3, 11]} desktop={[3, 11]} wide={[3, 11]}>
					<HeaderStore />
				</Row>
				{!!step?.label && (
					<>
						<Row landscape={[3, 11]} desktop={[3, 11]} wide={[3, 11]}>
							<div className="acquisition-flow__button-back">
								<Link
									href={step?.backLink}
									variant="insurance"
									size="small"
									styles="ghost"
									data-gtm-type="click"
									data-gtm-clicktype="button"
									data-gtm-name={`porto-servico:${tagStep[stepIndex].name}`}
									data-gtm-subname={`${tagStep[stepIndex].subname}:voltar`}
								>
									<Image
										src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAYAAAC5tzfZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC4SURBVHgBlZHNDYJAEIXfoHimBEvQDtiD3qnAWKFXowewAizBEvCqIeMbSAguu0TfYbOTzDc/bwS+8jJDKif+MrzVoXKNn7IMACUEmy5OseZ796EkCqgecXUTwCQBoCHgYkAP+R1aLdAiCnDHh2BX1QPwi1S3STfOP1ogW9LWAiuOB3ZTFhAakMyMd7bxTLbXGMS8Eb3ldsAXE+0mwqOK1NjfDjFIvqJxRxOXDnWUSZkB1CcuLkdAH4qORfb2BlL3AAAAAElFTkSuQmCC"
										alt=""
										width={13}
										height={13}
									/>
									Voltar
								</Link>
							</div>
							<Stepper.Root className="acquisition-flow__stepper">
								<Stepper.Header>
									<Stepper.Legend>
										<strong>{`${stepIndex + 1} de ${
											page.steps?.length
										} `}</strong>
										{` - ${step?.label}`}
									</Stepper.Legend>
									<Stepper.Legend className="acquisition-flow__stepper-next-step">
										Próximo passo: {nextStepLabel}
									</Stepper.Legend>
								</Stepper.Header>
								<Stepper.Body>
									{page.steps.map((currentStep, index) => (
										<Stepper.Step
											key={currentStep.label}
											isActive={index === stepIndex}
											isCompleted={index < stepIndex}
										/>
									))}
								</Stepper.Body>
							</Stepper.Root>
						</Row>
						<Row landscape={[3, 11]} desktop={[3, 11]} wide={[3, 11]}>
							<div className="acquisition-flow__layout">{children}</div>
						</Row>
					</>
				)}
			</Grid>
		</section>
	);
};

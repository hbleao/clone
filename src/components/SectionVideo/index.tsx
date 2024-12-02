import { Grid } from '@porto-ocean/grid';
import { Row } from '@porto-ocean/row';
import { Typography } from '@porto-ocean/typography';

import './styles.scss';

export const SectionVideo = ({ title, description, videoUrl }: any) => {
	return (
		<section className="section-video margin-default">
			<Grid>
				<Row>
					<div className="section-video__container">
						<div className="section-video__container__text">
							<Typography
								as="h3"
								variant="title4"
								color="black100"
								weight="medium"
							>
								{title}
							</Typography>
							<Typography as="p" variant="body2" color="black75">
								{description}
							</Typography>
						</div>
						{videoUrl?.length > 0 && (
							<div className="section-video__video__container">
								<iframe
									className="section-video__video-iframe"
									src={videoUrl}
									allowFullScreen
									title="YouTube Video"
								/>
							</div>
						)}
					</div>
				</Row>
			</Grid>
		</section>
	);
};

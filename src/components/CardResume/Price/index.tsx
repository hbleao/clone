import { Typography } from '@porto-ocean/typography';

export const Price = ({ price, legend }) => {
	return (
		<div className="card-resume__price-container">
			<Typography as="span" variant="title5" className="card-resume__price">
				{price}
			</Typography>
			{!!legend && (
				<Typography as="span" variant="label" className="card-resume__legend">
					{legend}
				</Typography>
			)}
		</div>
	);
};

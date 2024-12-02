import './styles.scss';

import { Button } from '@porto-ocean/button';
import { Icon } from '@porto-ocean/icon';
import { Typography } from '@porto-ocean/typography';

import type { HeaderCartProps } from './types';

export const HeaderCart = ({ openCart, cartProducts }: HeaderCartProps) => {
	function formatValue(value: number) {
		return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
	}

	function handleTotalValue() {
		return cartProducts.reduce(
			(acc, product) => acc.fullPrice + product.fullPrice,
		);
	}

	return (
		<div className="cart__container">
			<div className="cart__container__title">
				<Typography variant="title5" color="black85">
					Carrinho
				</Typography>
				<Icon
					iconName="icon-porto-ic-close"
					size="text-md"
					onClick={() => openCart()}
				/>
			</div>
			<div className="cart__container__div" />
			{cartProducts.length > 0 && (
				<>
					<div className="cart__container__products">
						{cartProducts.map((product) => (
							<div
								key={product.productName}
								className="cart__container__products__item"
							>
								<div className="cart__container__products__item__details">
									<Typography variant="body1" weight="bold" color="black85">
										{product.productName}
									</Typography>
									<Typography variant="body2" color="black70">
										{product.productSubName}
									</Typography>
									<Typography variant="caption" color="black65">
										{product.productDescription}
									</Typography>
									{product.portoDiscount && (
										<div className="cart__container__products__item__details__discount">
											<Icon
												iconName="icon-porto-ic-credit-card"
												color="portoSeguros100"
												size="text-md"
											/>
											<Typography
												variant="caption"
												weight="bold"
												color="portoSeguros100"
											>
												5% OFF no Cartão Porto
											</Typography>
										</div>
									)}
								</div>
								<div className="cart__container__products__item__price">
									<Typography variant="body1" weight="bold" color="black85">
										R$ {formatValue(product.fullPrice)}
									</Typography>
									<Typography variant="label" color="black70">
										{product.parcelsPrice}
									</Typography>
									<Typography variant="label" color="black70">
										sem juros
									</Typography>
								</div>
							</div>
						))}
					</div>
					<div className="cart__container__fullprice">
						<div className="cart__container__fullprice__total">
							<Typography variant="title5" color="black85">
								Total
							</Typography>
							<Typography variant="title5" color="black85">
								R$ {formatValue(handleTotalValue())}
							</Typography>
						</div>
						<Button variant="insurance" styles="primary" width="fluid">
							Revisar carrinho
						</Button>
					</div>
				</>
			)}

			{cartProducts.length === 0 && (
				<div className="cart__container__empty">
					<Typography variant="title6" color="black70">
						Seu carrinho está vazio
					</Typography>
					<Typography variant="body2" color="black65">
						Continue navegando para escolher suas soluções Porto!
					</Typography>
				</div>
			)}
		</div>
	);
};

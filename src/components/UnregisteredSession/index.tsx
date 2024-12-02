'use client';

type UnregisteredSessionProps = {
	sectionName: string;
};

export const UnregisteredSession = ({
	sectionName,
}: UnregisteredSessionProps) => {
	return (
		<div
			style={{ backgroundColor: '#ccc', fontSize: '2.4rem', padding: '2rem' }}
		>
			<p>Componente {sectionName} não cadastrado!!!</p>
		</div>
	);
};

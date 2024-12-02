import fs from 'node:fs';
import csv from 'csv-parser';

interface CSVRecord {
	cod: string;
	caps: string;
	endereco: string;
	bairro: string;
	cidade: string;
	estado: string;
	cep: string;
	macro_regioes: string;
	ddd: string;
	telefone: string;
	razao_social: string;
	cnpj: string;
	funcionamento_semana: string;
	funcionamento_sabado: string;
	email: string;
	status: string;
	latitude: string;
	longitude: string;
}

interface JSONRecord {
	code: string;
	name: string;
	address: string;
	district: string;
	city: string;
	state: string;
	zipCode: string;
	macroRegions: string;
	areaCode: string;
	phone: string;
	companyName: string;
	taxId: string;
	workingSaturday: boolean;
	email: string;
	latitude: string;
	longitude: string;
}

const csvFilePath = 'lista-oficinas.csv';
const jsonFilePath = 'out/lista-oficinas.json';

const csvRecords: JSONRecord[] = [];

const parseWorkingHours = (hours: string): string[] => {
	if (hours === 'SEM EXPEDIENTE') {
		return [];
	}
	return hours.split(' e ').map((period) => period.replace(' as ', '-'));
};

fs.mkdirSync('out', { recursive: true });

fs.createReadStream(csvFilePath)
	.pipe(csv())
	.on('data', (row: CSVRecord) => {
		const jsonRecord: JSONRecord = {
			code: row.cod,
			name: row.caps,
			address: row.endereco,
			district: row.bairro,
			city: row.cidade,
			state: row.estado,
			zipCode: row.cep,
			macroRegions: row.macro_regioes,
			areaCode: row.ddd,
			phone: row.telefone,
			companyName: row.razao_social,
			taxId: row.cnpj,
			workingSaturday: parseWorkingHours(row.funcionamento_sabado).length > 0,
			email: row.email,
			latitude: row.latitude,
			longitude: row.longitude,
		};
		csvRecords.push(jsonRecord);
	})
	.on('end', () => {
		fs.writeFileSync(jsonFilePath, JSON.stringify(csvRecords, null, 2));
		console.log('CSV file successfully processed and converted to JSON');
	});

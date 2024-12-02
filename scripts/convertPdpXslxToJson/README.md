# convert-pdp-xslx-to-json

`convert-pdp-xslx-to-json` é um utilitário Node.js que converte dados de arquivos Excel (.xlsx) em arquivos JSON.

## Requisitos

- Node.js v22 ou superior

## Instalação

1. Clone o repositório ou baixe os arquivos.

2. Navegue até o diretório do projeto e instale as dependências:

   ```sh
   npm install
   ```

## Uso

1. Coloque o arquivo Excel (`data.xlsx`) que você deseja converter no diretório raiz do projeto.

2. Execute o script de conversão:

   ```sh
   npm start
   ```

3. Os arquivos JSON gerados serão salvos no diretório `out`.

## Estrutura do Projeto

- `main.ts`: Script principal que faz a leitura do arquivo Excel, processa os dados e os salva em arquivos JSON.
- `package.json`: Arquivo de configuração do npm, incluindo dependências e scripts.

## Dependências

- [exceljs](https://www.npmjs.com/package/exceljs): Biblioteca para ler e escrever arquivos Excel.
- [slugify](https://www.npmjs.com/package/slugify): Biblioteca para transformar strings em slugs.
- [fs (File System)](https://nodejs.org/api/fs.html): Módulo nativo do Node.js para operações de sistema de arquivos.
- [path](https://nodejs.org/api/path.html): Módulo nativo do Node.js para trabalhar com caminhos de arquivos e diretórios.

### Instalação das Dependências

Para instalar as dependências, execute o comando:

```sh
npm install exceljs slugify
```

## Exemplo de Saída

```json
{
	"bannerHero": {
		"bgColor": "#D9F1FF",
		"title": "Check-up e troca de bateria",
		"description": "Recomendação: a cada 6 meses, 10 mil km ou durante troca e reparo de pneus\nInclui: mão de obra, avaliação da capacidade e troca da bateria",
		"image": {
			"src": "https://www.portoseguro.com.br/content/dam/vertical-servicos/centro-automotivo-porto/conteudo/bh-servico-automotivo-pastilha-freio.webp",
			"alt": "Check-up e troca de bateria"
		}
	},
	"section_price": {
		"description": "Consiste na troca bateria e na verificação do alternador e do sistema de carregamento, garantindo que todo o sistema elétrico esteja funcionando corretamente.",
		"price": "R$ 489,00"
	},
	"bannerBody": {
		"url": "https://www.portoseguro.com.br/content/dam/vertical-servicos/centro-automotivo-porto/conteudo/bb-servico-automotivo-troca-de-oleo.webp",
		"title": "Porque é importante",
		"benefits": [
			{
				"iconName": "icon-porto-ic-calendar",
				"text": "<p><strong>Evita problemas de partida:</strong> a bateria fornece a energia inicial para o motor de arranque. Se ela estiver fraca ou desgastada, o carro pode não ligar, especialmente em dias mais frios, quando o motor exige mais energia para funcionar.</p>"
			},
			{
				"iconName": "icon-porto-ic-calendar",
				"text": "<p><strong>Protege o sistema elétrico:</strong> baterias desgastadas ou com baixa carga podem gerar flutuações de tensão, o que pode danificar componentes elétricos do veículo, como centralinas, sensores e outros dispositivos sensíveis à variação de voltagem.</p>"
			}
		]
	},
	"section_testimonials": [
		{
			"name": "Leonardo Araujo",
			"date": "Tue Mar 12 2024 21:00:00 GMT-0300 (Brasilia Standard Time)",
			"text": "Fiz um diagnóstico da bateria e ocorreu tudo perfeito."
		},
		{
			"name": "Marlucia Abreu",
			"date": "Sun Jul 14 2024 21:00:00 GMT-0300 (Brasilia Standard Time)",
			"text": "Atendimento rápido e cordial. Fiquei muito satisfeita."
		}
	],
	"section_faq": {
		"sectionTitle": "Tire suas dúvidas sobre Check-up e troca de bateria",
		"questionsAndAnswers": [
			{
				"title": "Quais são os sinais de que a bateria precisa ser trocada?",
				"description": "Sinais incluem dificuldade para dar partida no veículo, luzes fracas, cheiro de ácido ou vazamentos, e a luz de verificação da bateria no painel acesa."
			},
			{
				"title": "Qual é a vida útil média de uma bateria de carro?",
				"description": "A vida útil média de uma bateria de carro é de 3 a 5 anos, mas pode variar dependendo do uso e das condições climáticas."
			}
		],
		"allBorder": "any",
		"allNegative": "boolean"
	}
}
```

Se precisar de mais informações ou ajuda, sinta-se à vontade para abrir uma issue ou entrar em contato.

# convert-workshop-csv-to-json

`convert-workshop-csv-to-json` é um utilitário Node.js que converte dados de arquivos CSV em arquivos JSON.

## Requisitos

- Node.js v22 ou superior

## Instalação

1. Clone o repositório ou baixe os arquivos.

2. Navegue até o diretório do projeto e instale as dependências:

    ```sh
    npm install
    ```

## Uso

1. Coloque o arquivo CSV (`lista-oficinas.csv`) que você deseja converter no diretório raiz do projeto.

2. Execute o script de conversão:

    ```sh
    npm start
    ```

### Nota sobre o uso do `--experimental-strip-types`

O script é executado utilizando a flag `--experimental-strip-types`, que permite rodar o arquivo TypeScript sem a necessidade de compilação prévia. Esta flag é experimental e pode mudar em versões futuras do Node.js. O comando completo é:

```sh
node --trace-warnings --experimental-strip-types main.ts
```

3. O arquivo JSON gerado será salvo como `lista-oficinas.json` no diretório raiz do projeto.

## Estrutura do Projeto

- `main.ts`: Script principal que faz a leitura do arquivo CSV, processa os dados e os salva em um arquivo JSON.
- `package.json`: Arquivo de configuração do npm, incluindo dependências e scripts.

## Dependências

- [csv-parser](https://www.npmjs.com/package/csv-parser): Biblioteca para ler arquivos CSV.

Se precisar de mais informações ou ajuda, sinta-se à vontade para abrir uma issue ou entrar em contato.

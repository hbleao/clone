# @porto-seguro/react-ssr-corp-psrv-porto-servicos

## Update all deps

```
npm i @porto-ocean/accordion @porto-ocean/banner-hero @porto-ocean/breadcrumb @porto-ocean/button @porto-ocean/cards-carousel @porto-ocean/carousel @porto-ocean/chip @porto-ocean/css @porto-ocean/grid @porto-ocean/row @porto-ocean/header @porto-ocean/hooks @porto-ocean/icon @porto-ocean/show-on-device @porto-ocean/typography @porto-ocean/utils @porto-ocean/banner-body @porto-ocean/card-content @porto-ocean/card-testimonial @porto-ocean/input @porto-ocean/footer @porto-ocean/modal @porto-ocean/card-icon @porto-ocean/notification @porto-ocean/dropdown @porto-ocean/text-body @porto-ocean/textarea
```

## Ambiente de desenvolvimento

https://servicos.hub-de-vendas-ecommerce.dev.awsporto

## Ambiente de homologação:

https://servicos.hub-de-vendas-ecommerce.hml.awsporto

Esse projeto foi gerando via [Tech Store](https://portostage.portoseguro.brasil/).

## Instalação das dependências

Rode `npm install` para executar a instalação das dependências do projeto. Será necessário para execução dos comandos `npm`.

## Execução do projeto em desenvolvimento

Rode `npm run dev` para executar o servidor local do projeto e acesse `http://localhost:3000/`.

## Execução do projeto em produção

Para simular o ambiente de produção, rode `npm run build` para gerar os artefatos e em seguida `npm run start`. Acesse `http://localhost:3000/react-ssr-corp-psrv-porto-servicos`.

## Execução do build

Rode `npm run build` para executar o build do projeto. Os artefatos serão armazenados no diretório `dist/react-ssr-corp-psrv-porto-servicos`.

## Execução dos testes unitários

Rode `npm run test` para executar os testes unitários via [Jest](https://www.npmjs.com/package/jest). Os resultados serão armazenados no diretório `coverage`.


## Processos Tech Store

### Cadastro de variável ambiente na tech store

Para fazer o cadastro de uma nova secret de autenticação na tech store
o formato de base64 com as informaçôes de <client_id>:<client_secret>, esse encode vai nos gerar um token.

Exemplo do retorno do fomato do token: AHksuSSImNmOS00MmY2LThiZjYtZmE2YzFiMGIwMjAwOmM1NWIzNmQ4LWQ10HyyTllGJmNy04YjlhLWMwN==

Com esse token em mão podemos cadastrar em uma secret do cofre.

# Pontos de melhoria

[ ] Não temos um padrão de escrita de código definida para o time
  - Ex: Não temos um padrão de como vamos utilizar as tipagens se vamos usar interface ou type,
  se o sufixo das tipagens dos metodos vão ser PROPS ou IPROPS.

[ ] Não temos testes automatizados para testar o fluxo
  - Por conta do prazo apertado e da correria do dia a dia não priorizamos a qualidade de
  nossas entregas e deixamos os testes automatizados de lado, assim sempre ou quase sempre
  que alteramos o código podemos gerar bugs imprevisívies

[ ] Não aplicamos a regra do escoteiro no código
  - Por conta da pressão pela entrega rapida do software muitas vezes deixamos o código pior do que
  encontramos.

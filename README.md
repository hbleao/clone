# CMS (Sistema de Gerenciamento de Conteúdo)

## Descrição
O projeto é um CMS (Sistema de Gerenciamento de Conteúdo), focado na criação e gerenciamento de sites/aplicativos de forma estruturada e otimizada para SEO.

## Funcionalidades Principais

### Sistema de Usuários:
- Cadastro e autenticação
- Níveis de acesso (roles)
- Atributos: nome, email, senha, registro
- Role padrão: "AUTHOR"

### Gerenciamento de Aplicativos:
- Criação, edição e exclusão de apps
- Atributos: título, nome, descrição, slug
- Vinculação a usuários específicos
- Interface de listagem de apps

### Sistema de Páginas:
- Gerenciamento de páginas por app
- Status: rascunho, publicado, arquivado
- Tipos: landing, blog, form
- Sistema de autoria e datas
- Conteúdo em JSON

### Otimização SEO:
- Meta títulos e descrições
- Palavras-chave
- Tags Open Graph
- URLs canônicas
- Controle de robots

### Templates de Seção:
- Templates reutilizáveis
- Tipos: hero, features, testimonials
- Esquema de campos personalizável
- Dados padrão configuráveis
- Thumbnails

### Interface do Usuário:
- Drag-and-drop
- Formulários interativos
- Modais
- Feedback visual
- Interface responsiva

## Recursos Técnicos:
- SQLite + Prisma ORM
- Rotas dinâmicas
- Validações
- URLs amigáveis
- Sistema de slugs únicos

## Organização:
- Estrutura: App > Páginas > Seções
- Templates reutilizáveis
- Versionamento (draft/published)
- Organização por slugs

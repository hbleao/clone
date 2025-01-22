import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface FileOrFolder {
  name: string;
  isDirectory: boolean;
  path: string;
}

export const listFilesAndFolders = async (
  folderPath: string
): Promise<FileOrFolder[]> => {
  try {
    const files = await fs.readdir(folderPath);
    
    const filesAndFolders = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const stats = await fs.stat(filePath);
        
        return {
          name: file,
          isDirectory: stats.isDirectory(),
          path: filePath,
        };
      })
    );
    
    return filesAndFolders;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
};

export const readJsonFile = async (filePath: string) => {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${filePath}:`, error);
    return null;
  }
};

export const readAllJsonFiles = async (folderPath: string) => {
  try {
    const files = await fs.readdir(folderPath);
    
    const jsonFiles = files.filter(file => path.extname(file) === '.json');
    
    const jsonContents = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const content = await readJsonFile(filePath);
        return {
          filename: file,
          content: content
        };
      })
    );
    
    return jsonContents;
  } catch (error) {
    console.error("Erro ao ler arquivos JSON:", error);
    return [];
  }
};

export const convertToSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const convertToCamelCase = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
};

export const convertToKebabCase = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-');
};

// Função principal para processar argumentos de linha de comando
const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Uso: npm run converter <comando> <argumento>');
    console.log('Comandos disponíveis:');
    console.log('  list [caminho] - Lista arquivos e pastas');
    console.log('  slug <texto> - Converte texto para slug');
    console.log('  camel <texto> - Converte texto para camelCase');
    console.log('  kebab <texto> - Converte texto para kebab-case');
    console.log('  read <caminho-do-arquivo> - Lê o conteúdo de um arquivo JSON');
    console.log('  readall <caminho-do-diretorio> - Lê todos os JSONs de um diretório');
    return;
  }

  const comando = args[0];
  const argumento = args[1];

  switch (comando) {
    case 'list':
      const caminho = argumento || process.cwd();
      const arquivos = await listFilesAndFolders(caminho);
      console.log(JSON.stringify(arquivos, null, 2));
      break;
    
    case 'slug':
      if (!argumento) {
        console.error('Por favor, forneça um texto para converter');
        return;
      }
      console.log(convertToSlug(argumento));
      break;
    
    case 'camel':
      if (!argumento) {
        console.error('Por favor, forneça um texto para converter');
        return;
      }
      console.log(convertToCamelCase(argumento));
      break;
    
    case 'kebab':
      if (!argumento) {
        console.error('Por favor, forneça um texto para converter');
        return;
      }
      console.log(convertToKebabCase(argumento));
      break;
    
    case 'read':
      if (!argumento) {
        console.error('Por favor, forneça o caminho do arquivo JSON');
        return;
      }
      const conteudoJson = await readJsonFile(argumento);
      console.log(JSON.stringify(conteudoJson, null, 2));
      break;
    
    case 'readall':
      if (!argumento) {
        console.error('Por favor, forneça o caminho do diretório');
        return;
      }
      const todosJsons = await readAllJsonFiles(argumento);
      console.log(JSON.stringify(todosJsons, null, 2));
      break;
    
    default:
      console.log(`Comando desconhecido: ${comando}`);
  }
};

// Executa a função principal
main().catch(console.error);

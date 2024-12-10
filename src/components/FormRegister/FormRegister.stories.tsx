import type { Meta, StoryObj } from '@storybook/react';
import { FormRegister } from './index';

const meta = {
  title: 'Components/FormRegister',
  component: FormRegister,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof FormRegister>;

export default meta;
type Story = StoryObj<typeof FormRegister>;

// Estado padrão do formulário
export const Padrão: Story = {};

// Estado de carregamento
export const Carregando: Story = {
  parameters: {
    mockData: {
      isLoading: true,
    },
  },
};

// Com erro de validação de email
export const ErroDeEmail: Story = {
  parameters: {
    mockData: {
      errors: {
        email: 'Email inválido',
      },
      form: {
        email: 'email-invalido',
        password: 'Senha123!',
      },
    },
  },
};

// Com erro de validação de senha
export const ErroDeSenha: Story = {
  parameters: {
    mockData: {
      errors: {
        password: 'A senha deve conter pelo menos 5 caracteres, um número e um caractere especial',
      },
      form: {
        email: 'usuario@exemplo.com',
        password: 'senha',
      },
    },
  },
};

// Com erro de registro (email já existe)
export const ErroDeRegistro: Story = {
  parameters: {
    mockData: {
      signupError: {
        message: 'Este email já está cadastrado',
      },
    },
  },
};

// Com erro de conexão
export const ErroDeConexão: Story = {
  parameters: {
    mockData: {
      networkError: true,
    },
  },
};

// Com dados preenchidos corretamente
export const DadosPreenchidos: Story = {
  parameters: {
    mockData: {
      form: {
        email: 'usuario@exemplo.com',
        password: 'Senha123!',
      },
    },
  },
};

// Tema escuro
export const TemaEscuro: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

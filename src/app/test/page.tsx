"use client";

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function TestPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4">Página de Teste</h1>
        <p>Esta é uma página criada para demonstração e teste do sistema.</p>
      </main>
    </div>
  );
}

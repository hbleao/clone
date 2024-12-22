"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAppBySlug } from '@/actions/app';
import './styles.scss';

interface App {
  id: string;
  name: string;
  description?: string;
  owner: string;
  userId: string;
  slug: string;
}

export default function AppDetailsPage() {
  const params = useParams();
  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      if (params.slug) {
        const result = await getAppBySlug(params.slug as string);
        if (result.app) {
          setApp(result.app);
        }
      }
      setLoading(false);
    };

    loadApp();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="app-details-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="app-details-container">
        <div className="error">Aplicativo não encontrado</div>
      </div>
    );
  }

  return (
    <div className="app-details-container">
      <div className="app-details-card">
        <h1>{app.name}</h1>
        <div className="info-section">
          <div className="info-item">
            <label>Proprietário</label>
            <p>{app.owner}</p>
          </div>
          {app.description && (
            <div className="info-item">
              <label>Descrição</label>
              <p>{app.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

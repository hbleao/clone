
export const carbonOnSaveDatabaseService = async (data: any, pageSlug: string) =>  {
  try {
    const endpoint = `https://api.hub-de-vendas-carbon.dev.awsporto/acquisition/service-provision/cms?product=porto_service&${pageSlug}`;

  await fetch(endpoint, {
    method: 'POST',
    body: data
  })
  } catch (error) {
    throw new Error('Falha ao salvar página no banco da carbon')
  }
}




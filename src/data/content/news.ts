export type NewsArticle = { id: string; slug: string; title: string; excerpt: string; category: string; image: string; publishedAt: string; body: string[]; isDemo: boolean };
export const news: NewsArticle[] = [
  { id:'demo-1', slug:'demonstracao-jornalismo-regional', title:'Jornalismo regional em destaque', excerpt:'Conteúdo ilustrativo para demonstrar a apresentação das notícias no portal.', category:'Região', image:'/assets/editorial/news-region.webp', publishedAt:'', body:['Esta matéria é demonstrativa e será substituída por uma publicação real da equipe.'], isDemo:true },
  { id:'demo-2', slug:'demonstracao-esporte-amador', title:'O esporte amador ganha espaço', excerpt:'Exemplo visual de notícia sobre iniciativas esportivas locais.', category:'Esportes', image:'/assets/editorial/news-sport.webp', publishedAt:'', body:['Conteúdo de demonstração, não representa um evento ocorrido.'], isDemo:true },
];

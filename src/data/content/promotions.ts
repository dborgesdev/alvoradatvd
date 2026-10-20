export type Promotion = { id: string; title: string; description: string; image: string; url: string | null; isDemo: boolean };
export const promotions: Promotion[] = []; // Não anunciar promoções inexistentes.

import { Quote, Product, User, QuoteStatus, UserRole, Video, CalendarEvent } from '../types';

// Key constants
const KEYS = {
  QUOTES: 'gwo_quotes',
  PRODUCTS: 'gwo_products',
  USER: 'gwo_user',
  EVENTS: 'gwo_events'
};

// Initial Data Seeding
const seedData = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    const products: Product[] = [
      { id: '1', name: 'Lona Frontlight 440g', unit: 'm²', price: 85.00, cost: 35.00 },
      { id: '2', name: 'Adesivo Vinil Brilho', unit: 'm²', price: 65.00, cost: 25.00 },
      { id: '3', name: 'Cartão de Visita 300g (1000 un)', unit: 'milheiro', price: 120.00, cost: 45.00 },
      { id: '4', name: 'Instalação (Hora Técnica)', unit: 'hora', price: 150.00, cost: 0.00 },
    ];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  }

  if (!localStorage.getItem(KEYS.QUOTES)) {
    const quotes: Quote[] = [
      {
        id: '1001',
        clientName: 'Padaria do João',
        items: [
          { id: 'a1', productId: '1', productName: 'Lona Frontlight 440g', quantity: 10, unitPrice: 85.00, total: 850.00 }
        ],
        total: 850.00,
        status: QuoteStatus.APPROVED,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        validUntil: new Date(Date.now() + 86400000 * 5).toISOString(),
      },
      {
        id: '1002',
        clientName: 'Academia Fit',
        items: [
          { id: 'b1', productId: '2', productName: 'Adesivo Vinil Brilho', quantity: 5, unitPrice: 65.00, total: 325.00 }
        ],
        total: 325.00,
        status: QuoteStatus.OPEN,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        validUntil: new Date(Date.now() + 86400000 * 6).toISOString(),
      }
    ];
    localStorage.setItem(KEYS.QUOTES, JSON.stringify(quotes));
  }
};

// Initialize
seedData();

// --- API Methods ---

export const getProducts = (): Product[] => {
  const data = localStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const addProduct = (product: Product): void => {
  const products = getProducts();
  products.push(product);
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
};

export const getQuotes = (): Quote[] => {
  const data = localStorage.getItem(KEYS.QUOTES);
  return data ? JSON.parse(data) : [];
};

export const addQuote = (quote: Quote): void => {
  const quotes = getQuotes();
  quotes.unshift(quote); // Add to top
  localStorage.setItem(KEYS.QUOTES, JSON.stringify(quotes));
};

export const updateQuoteStatus = (id: string, status: QuoteStatus): void => {
  const quotes = getQuotes();
  const index = quotes.findIndex(q => q.id === id);
  if (index !== -1) {
    quotes[index].status = status;
    localStorage.setItem(KEYS.QUOTES, JSON.stringify(quotes));
  }
};

export const getEvents = (): CalendarEvent[] => {
    const data = localStorage.getItem(KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
};

export const addEvent = (event: CalendarEvent): void => {
    const events = getEvents();
    events.push(event);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const login = (email: string, password: string): boolean => {
  // Mock login
  if (email === 'admin@gestao.com' && password === 'admin') {
    const user: User = {
      id: '1',
      name: 'Wesley Oliveira',
      email: email,
      role: UserRole.ADMIN
    };
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(KEYS.USER);
};

export const mockVideos: Video[] = [
  { id: '1', title: 'Como aplicar adesivo sem bolhas', category: 'Aplicação', duration: '5:20', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: '2', title: 'Manutenção da Plotter', category: 'Manutenção', duration: '12:10', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: '3', title: 'Técnicas de Vendas', category: 'Gestão', duration: '8:45', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];
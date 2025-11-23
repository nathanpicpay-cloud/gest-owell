import { Quote, Product, User, QuoteStatus, UserRole, Video, CalendarEvent, ProductionOrder, ProductionStage, Priority, OrderNote } from '../types';

// Key constants
const KEYS = {
  QUOTES: 'gwo_quotes',
  PRODUCTS: 'gwo_products',
  USER: 'gwo_user',
  EVENTS: 'gwo_events',
  PRODUCTION: 'gwo_production_orders'
};

// Initial Data Seeding
const seedData = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    const products: Product[] = [
      { id: '1', name: 'Lona Frontlight 440g', unit: 'm²', price: 85.00, cost: 35.00 },
      { id: '2', name: 'Adesivo Vinil Brilho', unit: 'm²', price: 65.00, cost: 25.00 },
      { id: '3', name: 'Cartão de Visita 300g (1000 un)', unit: 'milheiro', price: 120.00, cost: 45.00 },
      { id: '4', name: 'Instalação (Hora Técnica)', unit: 'hora', price: 150.00, cost: 0.00 },
      { id: '5', name: 'Banner Roll-up', unit: 'unid', price: 250.00, cost: 120.00 },
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

  // Seed Production Orders (Kanban)
  if (!localStorage.getItem(KEYS.PRODUCTION)) {
    const orders: ProductionOrder[] = [
      {
        id: 'OS-204',
        quoteId: '1001',
        clientName: 'Padaria do João',
        title: 'Fachada Principal',
        stage: ProductionStage.ART_IN_PROGRESS,
        priority: Priority.HIGH,
        deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
        description: 'Lona com acabamento em ilhós. Cliente quer fundo vermelho vibrante.',
        items: ['Lona Frontlight 440g'],
        notes: [
          { id: 'n1', text: 'Logo recebida em vetor.', author: 'Wesley', createdAt: new Date().toISOString() }
        ]
      },
      {
        id: 'OS-205',
        quoteId: '1003',
        clientName: 'Advocacia Silva',
        title: 'Cartões de Visita',
        stage: ProductionStage.WAITING_ART,
        priority: Priority.NORMAL,
        deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
        description: '1000 cartões foscos com verniz localizado.',
        items: ['Cartão 300g'],
        notes: []
      },
      {
        id: 'OS-206',
        quoteId: '1004',
        clientName: 'Burger Kingo',
        title: 'Adesivos Promoção',
        stage: ProductionStage.PRINT_QUEUE,
        priority: Priority.URGENT,
        deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
        description: 'Adesivos para vitrine. Conferir corte especial.',
        items: ['Adesivo Vinil'],
        notes: [{ id: 'n2', text: 'Arte aprovada via WhatsApp.', author: 'Atendimento', createdAt: new Date().toISOString() }]
      }
    ];
    localStorage.setItem(KEYS.PRODUCTION, JSON.stringify(orders));
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
  quotes.unshift(quote);
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

// --- Production / OS Methods ---

export const getProductionOrders = (): ProductionOrder[] => {
  const data = localStorage.getItem(KEYS.PRODUCTION);
  return data ? JSON.parse(data) : [];
};

export const updateOrderStage = (id: string, stage: ProductionStage): void => {
  const orders = getProductionOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders[index].stage = stage;
    localStorage.setItem(KEYS.PRODUCTION, JSON.stringify(orders));
  }
};

export const addOrderNote = (orderId: string, noteText: string, author: string): void => {
  const orders = getProductionOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    const note: OrderNote = {
      id: Date.now().toString(),
      text: noteText,
      author,
      createdAt: new Date().toISOString()
    };
    orders[index].notes.push(note);
    localStorage.setItem(KEYS.PRODUCTION, JSON.stringify(orders));
  }
};

// --- Auth Methods ---

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const login = (email: string, password: string): boolean => {
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
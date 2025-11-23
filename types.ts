export enum UserRole {
  ADMIN = 'admin',
  SALES = 'vendedor',
  PRODUCTION = 'producao',
  CLIENT = 'cliente'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  unit: string; // e.g., 'm2', 'unid'
  price: number;
  cost: number;
}

export interface QuoteItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export enum QuoteStatus {
  DRAFT = 'Rascunho',
  OPEN = 'Em Aberto',
  APPROVED = 'Aprovado',
  IN_PRODUCTION = 'Em Produção',
  COMPLETED = 'Concluído',
  CANCELLED = 'Cancelado'
}

export interface Quote {
  id: string;
  clientName: string;
  clientDoc?: string; // CPF/CNPJ
  items: QuoteItem[];
  total: number;
  status: QuoteStatus;
  createdAt: string; // ISO String
  validUntil: string; // ISO String
}

export interface Video {
  id: string;
  title: string;
  category: string;
  url: string; // Local file path simulation or placeholder
  duration: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO String
  description: string;
}
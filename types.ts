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

// --- Novos Tipos para o Kanban de Produção ---

export enum ProductionStage {
  WAITING_ART = 'Aguardando Arte',
  ART_IN_PROGRESS = 'Em Criação',
  CLIENT_APPROVAL = 'Aprovação Cliente',
  PRINT_QUEUE = 'Fila de Impressão',
  FINISHING = 'Acabamento/Corte',
  READY = 'Pronto p/ Entrega'
}

export enum Priority {
  LOW = 'Baixa',
  NORMAL = 'Normal',
  HIGH = 'Alta',
  URGENT = 'Urgente'
}

export interface OrderNote {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface ProductionOrder {
  id: string;
  quoteId: string;
  clientName: string;
  title: string; // Ex: "Fachada Loja X" ou "Cartões Fulano"
  stage: ProductionStage;
  priority: Priority;
  deadline: string; // ISO String
  description: string;
  notes: OrderNote[];
  items: string[]; // Resumo dos itens (ex: ["Lona 440g", "Adesivo"])
}
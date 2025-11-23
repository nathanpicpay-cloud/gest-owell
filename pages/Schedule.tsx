import React, { useState, useEffect } from 'react';
import { getEvents, addEvent } from '../services/db';
import { CalendarEvent } from '../types';
import { Calendar as CalendarIcon, Download, Plus } from 'lucide-react';

const Schedule: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate,
      description: newDesc
    };
    addEvent(event);
    setEvents(getEvents());
    setIsModalOpen(false);
    setNewTitle('');
    setNewDate('');
    setNewDesc('');
  };

  const downloadICS = (event: CalendarEvent) => {
    // Simple ICS generator
    const formatDate = (dateStr: string) => {
        return dateStr.replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    // Note: In a real app, parse the date string properly to UTC
    const start = formatDate(new Date(event.date).toISOString());
    const end = formatDate(new Date(new Date(event.date).getTime() + 3600000).toISOString()); // +1 hour

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GestaoWesley//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${event.id}@gestaowesley.local
DTSTAMP:${formatDate(new Date().toISOString())}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `evento_${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Agenda</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} /> Novo Agendamento
        </button>
      </div>

      <div className="space-y-4">
        {events.map(event => (
            <div key={event.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-center min-w-[60px]">
                        <span className="block text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="block text-xl font-bold">{new Date(event.date).getDate()}</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{event.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {event.description}</p>
                    </div>
                </div>
                <button 
                    onClick={() => downloadICS(event)}
                    className="text-gray-400 hover:text-blue-600 p-2"
                    title="Baixar .ics"
                >
                    <Download size={20} />
                </button>
            </div>
        ))}
        {events.length === 0 && <p className="text-gray-400">Nenhum agendamento futuro.</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Novo Evento</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input required type="text" className="w-full border p-2 rounded mt-1" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data e Hora</label>
                <input required type="datetime-local" className="w-full border p-2 rounded mt-1" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input type="text" className="w-full border p-2 rounded mt-1" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 py-2 rounded hover:bg-gray-200">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
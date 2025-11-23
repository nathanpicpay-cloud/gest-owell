import React from 'react';
import { mockVideos } from '../services/db';
import { PlayCircle, Clock } from 'lucide-react';

const Videos: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Vídeos & Tutoriais</h2>
        <p className="text-gray-500">Aprenda técnicas de aplicação e gestão.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideos.map(video => (
          <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 group cursor-pointer">
            <div className="h-40 bg-slate-900 flex items-center justify-center relative">
                {/* Placeholder for thumbnail */}
                <PlayCircle size={48} className="text-white opacity-80 group-hover:scale-110 transition-transform" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{video.category}</span>
                <div className="flex items-center text-xs text-gray-400 gap-1">
                    <Clock size={12} /> {video.duration}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 leading-tight mb-2">{video.title}</h3>
              <a 
                href={video.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-slate-600 hover:text-blue-600 underline decoration-slate-300 underline-offset-4"
              >
                Assistir Agora
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
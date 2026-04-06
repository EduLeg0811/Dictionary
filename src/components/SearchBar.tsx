import { useState, FormEvent } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';

interface SearchBarProps {
  onSearch: (term: string, mode: 'lexical' | 'analogical') => void;
  isLoading: boolean;
  activeMode: 'lexical' | 'analogical' | null;
}

export function SearchBar({ onSearch, isLoading, activeMode }: SearchBarProps) {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: FormEvent, mode: 'lexical' | 'analogical') => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term.trim(), mode);
    }
  };

  return (
    <div className="mb-8 rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900">
          Consulta de Dicionários
        </h1>
        <p className="mb-8 text-slate-600">
          Pesquise definições, etimologias e termos relacionados
        </p>

        <form onSubmit={(e) => handleSubmit(e, activeMode || 'lexical')} className="space-y-4">
          <Input
            type="text"
            placeholder="Digite uma palavra..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            disabled={isLoading}
            className="text-lg"
          />

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              isActive={activeMode === 'lexical'}
              onClick={(e) => handleSubmit(e, 'lexical')}
              disabled={isLoading || !term.trim()}
              className="flex-1"
            >
              <Search size={18} className="mr-2" />
              Definições
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              isActive={activeMode === 'analogical'}
              onClick={(e) => handleSubmit(e, 'analogical')}
              disabled={isLoading || !term.trim()}
              className="flex-1"
            >
              <BookOpen size={18} className="mr-2" />
              Ideias Afins
            </Button>

            {isLoading && (
              <div className="flex items-center justify-center w-12">
                <Spinner size={24} />
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

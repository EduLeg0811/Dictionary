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
    <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-8 mb-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-stone-900 mb-2 tracking-tight">
          Consulta de Dicionários
        </h1>
        <p className="text-stone-600 mb-8">
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

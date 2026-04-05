import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { LexicalView } from './components/LexicalView';
import { AnalogicalView } from './components/AnalogicalView';
import { fetchLexical, fetchAnalogical, type LexicalResponse, type AnalogicalResponse } from './services/api';

type ViewMode = 'lexical' | 'analogical' | null;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<ViewMode>(null);
  const [lexicalData, setLexicalData] = useState<LexicalResponse | null>(null);
  const [analogicalData, setAnalogicalData] = useState<AnalogicalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchTerm, setLastSearchTerm] = useState<string>('');

  const handleSearch = async (term: string, mode: 'lexical' | 'analogical') => {
    if (lastSearchTerm === term && activeMode === mode) {
      if (mode === 'lexical' && lexicalData) {
        return;
      }
      if (mode === 'analogical' && analogicalData) {
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setActiveMode(mode);
    setLastSearchTerm(term);

    try {
      if (mode === 'lexical') {
        const data = await fetchLexical(term);
        setLexicalData(data);
      } else {
        const data = await fetchAnalogical(term);
        setAnalogicalData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container py-8 md:py-12">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} activeMode={activeMode} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              <span className="font-medium">Erro:</span> {error}
            </p>
          </div>
        )}

        {activeMode === 'lexical' && lexicalData && <LexicalView data={lexicalData} />}
        {activeMode === 'analogical' && analogicalData && <AnalogicalView data={analogicalData} />}

        {!activeMode && !isLoading && (
          <div className="text-center py-16">
            <p className="text-stone-500 text-lg">
              Digite uma palavra e escolha o tipo de consulta para começar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import type { LexicalResponse } from '../services/api';

interface LexicalViewProps {
  data: LexicalResponse;
}

export function LexicalView({ data }: LexicalViewProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const { result, debug, pipeline } = data;

  const filteredPipeline = selectedSource
    ? pipeline.filter((stage) => stage.source === selectedSource)
    : pipeline;

  const toggleSource = (source: string) => {
    setSelectedSource(selectedSource === source ? null : source);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Entrada Consolidada
                </p>
                <h2 className="text-3xl font-semibold text-stone-900 tracking-tight">
                  {result.term}
                </h2>
              </div>
              <Badge variant="info">{result.lang}</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="subtle" size="sm">
                {debug.sources_ok}/{debug.sources_total} fontes
              </Badge>
              <Badge variant="subtle" size="sm">
                {result.summary.definitions.length} definições
              </Badge>
              <Badge variant="subtle" size="sm">
                {result.summary.synonyms.length} sinônimos
              </Badge>
              <Badge variant="subtle" size="sm">
                <Clock size={12} className="mr-1" />
                {debug.elapsed_ms}ms
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {debug.source_details.map((source) => (
                <button
                  key={source.source}
                  onClick={() => toggleSource(source.source)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                    selectedSource === source.source
                      ? 'bg-sky-50 border-sky-300 text-sky-900'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {source.source} ({source.definition_count})
                  {source.accent_retry && <span className="ml-1 text-xs">*</span>}
                </button>
              ))}
            </div>
          </CardHeader>

          {result.summary.etymology && (
            <CardContent className="border-t border-stone-100">
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Etimologia</h3>
              <div className="bg-sky-50 border-l-4 border-sky-400 rounded-r-lg p-4">
                <p className="text-stone-700 leading-relaxed">{result.summary.etymology}</p>
              </div>
            </CardContent>
          )}

          <CardContent className="border-t border-stone-100">
            <h3 className="text-sm font-semibold text-stone-900 mb-4">Definições</h3>
            {result.summary.definitions.length > 0 ? (
              <ol className="space-y-4">
                {result.summary.definitions.map((def, index) => (
                  <li key={index} className="pl-1">
                    <div className="flex gap-3">
                      <span className="text-sm font-medium text-stone-500 mt-0.5">{index + 1}.</span>
                      <p className="text-stone-700 leading-relaxed flex-1">{def}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-stone-500 text-sm">Nenhuma definição encontrada.</p>
            )}
          </CardContent>

          {result.summary.synonyms.length > 0 && (
            <CardContent className="border-t border-stone-100">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Sinônimos</h3>
              <div className="flex flex-wrap gap-2">
                {result.summary.synonyms.map((synonym, index) => (
                  <Badge key={index} variant="subtle">
                    {synonym}
                  </Badge>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-stone-900">Pipeline</h3>
            {selectedSource && (
              <p className="text-sm text-stone-600 mt-2">
                Filtrando: <span className="font-medium">{selectedSource}</span>
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredPipeline.length > 0 ? (
              filteredPipeline.map((stage, index) => (
                <details key={index} className="group">
                  <summary className="cursor-pointer list-none">
                    <div className="bg-stone-50 hover:bg-stone-100 transition-colors rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {stage.ok ? (
                              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                            ) : (
                              <XCircle size={16} className="text-red-600 flex-shrink-0" />
                            )}
                            <span className="font-medium text-stone-900 text-sm truncate">
                              {stage.source}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600">
                            {stage.data.definition_count} definições · {stage.elapsed_ms}ms
                          </p>
                        </div>
                        <Badge variant={stage.ok ? 'success' : 'warning'} size="sm">
                          {stage.ok ? 'OK' : 'Falha'}
                        </Badge>
                      </div>
                    </div>
                  </summary>
                  <div className="mt-2 p-4 bg-white border border-stone-200 rounded-lg">
                    {stage.error && (
                      <p className="text-sm text-red-600 mb-3">
                        <span className="font-medium">Erro:</span> {stage.error}
                      </p>
                    )}
                    {stage.data.definitions.length > 0 ? (
                      <ol className="space-y-2 text-sm text-stone-700">
                        {stage.data.definitions.map((def, i) => (
                          <li key={i} className="pl-1">
                            {i + 1}. {def}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-stone-500">Nenhuma definição encontrada.</p>
                    )}
                  </div>
                </details>
              ))
            ) : (
              <p className="text-sm text-stone-500">Nenhuma etapa corresponde ao filtro.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

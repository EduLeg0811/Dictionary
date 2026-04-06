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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Entrada Consolidada
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
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
                  className={`rounded-full border px-3 py-1.5 text-sm transition-all duration-200 ${
                    selectedSource === source.source
                      ? 'border-blue-200 bg-blue-50/90 text-blue-900'
                      : 'border-slate-200 bg-white/85 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {source.source} ({source.definition_count})
                  {source.accent_retry && <span className="ml-1 text-xs">*</span>}
                </button>
              ))}
            </div>
          </CardHeader>

          {result.summary.etymology && (
            <CardContent className="border-t border-slate-100">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Etimologia</h3>
              <div className="rounded-r-xl border-l-4 border-teal-300 bg-teal-50/70 p-4">
                <p className="leading-normal text-slate-700">{result.summary.etymology}</p>
              </div>
            </CardContent>
          )}

          <CardContent className="border-t border-slate-100">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Definições</h3>
            {result.summary.definitions.length > 0 ? (
              <ol className="space-y-1">
                {result.summary.definitions.map((def, index) => (
                  <li key={index} className="pl-1">
                    <div className="flex gap-3">
                      <span className="mt-0.5 text-sm font-medium text-slate-500">{index + 1}.</span>
                      <p className="flex-1 leading-normal text-slate-700">{def}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-500">Nenhuma definição encontrada.</p>
            )}
          </CardContent>

          {result.summary.synonyms.length > 0 && (
            <CardContent className="border-t border-slate-100">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Sinônimos</h3>
              <ol className="space-y-1">
                {result.summary.synonyms.map((synonym, index) => (
                  <li key={index} className="pl-1">
                    <div className="flex gap-3">
                      <span className="mt-0.5 text-sm font-medium text-slate-500">{index + 1}.</span>
                      <p className="flex-1 leading-normal text-slate-700">{synonym}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900">Pipeline</h3>
            {selectedSource && (
              <p className="mt-2 text-sm text-slate-600">
                Filtrando: <span className="font-medium">{selectedSource}</span>
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredPipeline.length > 0 ? (
              filteredPipeline.map((stage, index) => (
                <details key={index} className="group">
                  <summary className="list-none cursor-pointer">
                    <div className="rounded-xl bg-slate-50/80 p-4 transition-colors hover:bg-slate-100/80">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            {stage.ok ? (
                              <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-700" />
                            ) : (
                              <XCircle size={16} className="flex-shrink-0 text-rose-700" />
                            )}
                            <span className="truncate text-sm font-medium text-slate-900">
                              {stage.source}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {stage.data.definition_count} definições · {stage.elapsed_ms}ms
                          </p>
                        </div>
                        <Badge variant={stage.ok ? 'success' : 'warning'} size="sm">
                          {stage.ok ? 'OK' : 'Falha'}
                        </Badge>
                      </div>
                    </div>
                  </summary>
                  <div className="mt-2 rounded-xl border border-slate-200 bg-white/90 p-4">
                    {stage.error && (
                      <p className="mb-3 text-sm text-rose-700">
                        <span className="font-medium">Erro:</span> {stage.error}
                      </p>
                    )}
                    {stage.data.definitions.length > 0 ? (
                      <ol className="space-y-2 text-sm text-slate-700">
                        {stage.data.definitions.map((def, i) => (
                          <li key={i} className="pl-1">
                            {i + 1}. {def}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-slate-500">Nenhuma definição encontrada.</p>
                    )}
                  </div>
                </details>
              ))
            ) : (
              <p className="text-sm text-slate-500">Nenhuma etapa corresponde ao filtro.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

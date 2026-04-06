import { useState } from 'react';
import { Clock, ChevronDown, Columns2 as Columns } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import type { AnalogicalResponse } from '../services/api';

interface AnalogicalViewProps {
  data: AnalogicalResponse;
}

function prioritizeSenses(senses: AnalogicalResponse['result']['senses'], term: string) {
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const normalizedTerm = normalize(term);

  return [...senses].sort((a, b) => {
    const scoreA = normalize(a.title).includes(normalizedTerm) ? 1 : 0;
    const scoreB = normalize(b.title).includes(normalizedTerm) ? 1 : 0;
    return scoreB - scoreA;
  });
}

export function AnalogicalView({ data }: AnalogicalViewProps) {
  const [columns, setColumns] = useState(4);
  const { entry, result, debug } = data;
  const sortedSenses = prioritizeSenses(result.senses, result.term);

  const decreaseColumns = () => setColumns((prev) => Math.max(1, prev - 1));
  const increaseColumns = () => setColumns((prev) => Math.min(6, prev + 1));

  return (
    <div className="space-y-6">
      {entry.found && (
        <Card>
          <CardHeader>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {entry.label}
              </p>
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {entry.term}
                </h2>
                <Badge variant="info">Aulete</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.pronunciation && (
                  <Badge variant="subtle" size="sm">
                    {entry.pronunciation}
                  </Badge>
                )}
                {entry.grammar && (
                  <Badge variant="subtle" size="sm">
                    {entry.grammar}
                  </Badge>
                )}
                <Badge variant="subtle" size="sm">
                  {entry.sense_count} acepções
                </Badge>
              </div>
            </div>
          </CardHeader>

          {entry.definitions.length > 0 && (
            <CardContent className="border-t border-slate-100">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Definições</h3>
              <ol className="space-y-1">
                {entry.definitions.map((def, index) => (
                  <li key={def.index} className="pl-1">
                    <div className="flex gap-3">
                      <span className="mt-0.5 text-sm font-medium text-slate-500">{index + 1}.</span>
                      <p className="flex-1 leading-normal text-slate-700">{def.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          )}

          {entry.etymology && (
            <CardContent className="border-t border-slate-100">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Etimologia</h3>
              <div className="rounded-r-xl border-l-4 border-teal-300 bg-teal-50/70 p-4">
                <p className="leading-normal text-slate-700">{entry.etymology}</p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mapa Analógico
              </p>
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {result.term}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decreaseColumns}
                    disabled={columns <= 1}
                    title="Diminuir colunas"
                  >
                    <Columns size={16} />
                  </Button>
                  <span className="min-w-[4rem] text-center text-sm text-slate-600">
                    {columns} col.
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={increaseColumns}
                    disabled={columns >= 6}
                    title="Aumentar colunas"
                  >
                    <Columns size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="subtle" size="sm">
                {result.sense_count} acepções
              </Badge>
              <Badge variant="subtle" size="sm">
                {result.term_count} termos afins
              </Badge>
              <Badge variant="subtle" size="sm">
                <Clock size={12} className="mr-1" />
                {debug.elapsed_ms}ms
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="border-t border-slate-100">
          {sortedSenses.length > 0 ? (
            <div className="space-y-4">
              {sortedSenses.map((sense, index) => (
                <details key={index} className="group" open={index === 0}>
                  <summary className="list-none cursor-pointer select-none">
                    <div className="rounded-xl bg-slate-50/80 p-4 transition-colors hover:bg-slate-100/80">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-slate-900">{sense.title}</h3>
                          <p className="text-sm text-slate-600">
                            {sense.term_count} termos · {sense.classes.length} categorias
                          </p>
                        </div>
                        <ChevronDown
                          size={20}
                          className="mt-1 flex-shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                        />
                      </div>
                    </div>
                  </summary>

                  <div className="mt-3 space-y-4">
                    {sense.classes.map((classGroup, classIndex) => (
                      <div
                        key={classIndex}
                        className="rounded-2xl border border-slate-200 bg-white/85 p-5"
                      >
                        <div className="mb-4">
                          <h4 className="mb-1 font-medium text-slate-900">{classGroup.label}</h4>
                          <p className="text-sm text-slate-500">
                            {classGroup.term_count} termos · {classGroup.group_count} grupos
                          </p>
                        </div>
                        <ol
                          className="grid gap-x-6 gap-y-2"
                          style={{
                            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                            gridAutoFlow: 'column',
                            gridTemplateRows: `repeat(${Math.ceil(classGroup.terms.length / columns)}, minmax(0, auto))`,
                          }}
                        >
                          {classGroup.terms.map((term, termIndex) => (
                            <li key={termIndex} className="flex gap-2 text-sm text-slate-700">
                              <span className="tabular-nums text-slate-500">{termIndex + 1}.</span>
                              <span>{term}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-slate-500">Nenhuma relação analógica encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

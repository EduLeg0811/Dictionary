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
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {entry.label}
              </p>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h2 className="text-3xl font-semibold text-stone-900 tracking-tight">
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
            <CardContent className="border-t border-stone-100">
              <h3 className="text-sm font-semibold text-stone-900 mb-4">Definições</h3>
              <ol className="space-y-3">
                {entry.definitions.map((def) => (
                  <li key={def.index} value={def.index} className="pl-1 text-stone-700 leading-relaxed">
                    {def.text}
                  </li>
                ))}
              </ol>
            </CardContent>
          )}

          {entry.etymology && (
            <CardContent className="border-t border-stone-100">
              <h3 className="text-sm font-semibold text-stone-900 mb-3">Etimologia</h3>
              <div className="bg-sky-50 border-l-4 border-sky-400 rounded-r-lg p-4">
                <p className="text-stone-700 leading-relaxed">{entry.etymology}</p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Mapa Analógico
              </p>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <h2 className="text-2xl font-semibold text-stone-900 tracking-tight">
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
                  <span className="text-sm text-stone-600 min-w-[4rem] text-center">
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

        <CardContent className="border-t border-stone-100">
          {sortedSenses.length > 0 ? (
            <div className="space-y-4">
              {sortedSenses.map((sense, index) => (
                <details key={index} className="group" open={index === 0}>
                  <summary className="cursor-pointer list-none select-none">
                    <div className="bg-stone-50 hover:bg-stone-100 transition-colors rounded-lg p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-stone-900 mb-1">{sense.title}</h3>
                          <p className="text-sm text-stone-600">
                            {sense.term_count} termos · {sense.classes.length} categorias
                          </p>
                        </div>
                        <ChevronDown
                          size={20}
                          className="text-stone-400 transition-transform duration-200 group-open:rotate-180 flex-shrink-0 mt-1"
                        />
                      </div>
                    </div>
                  </summary>

                  <div className="mt-3 space-y-4">
                    {sense.classes.map((classGroup, classIndex) => (
                      <div
                        key={classIndex}
                        className="bg-white border border-stone-200 rounded-lg p-5"
                      >
                        <div className="mb-4">
                          <h4 className="font-medium text-stone-900 mb-1">{classGroup.label}</h4>
                          <p className="text-sm text-stone-500">
                            {classGroup.term_count} termos · {classGroup.group_count} grupos
                          </p>
                        </div>
                        <ul
                          className="grid gap-x-6 gap-y-2"
                          style={{
                            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                          }}
                        >
                          {classGroup.terms.map((term, termIndex) => (
                            <li key={termIndex} className="text-stone-700 text-sm">
                              {term}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-500">Nenhuma relação analógica encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

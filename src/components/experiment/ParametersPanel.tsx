import React from 'react';
import { ParameterSchema } from '../../types/experiment';
import { useTranslation } from '../../i18n/useTranslation';
import { Slider } from '../ui/Slider';
import { Card } from '../ui/Card';
import { Sliders } from 'lucide-react';

export interface ParametersPanelProps<TParams> {
  parametersSchema: ParameterSchema[];
  values: TParams;
  onChange: (key: keyof TParams, value: number) => void;
}

export function ParametersPanel<TParams extends Record<string, number>>({
  parametersSchema,
  values,
  onChange,
}: ParametersPanelProps<TParams>) {
  const { t, getLocalizedText } = useTranslation();

  return (
    <Card variant="elevated" padding="md" className="space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Sliders className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100">
          {t('simulation.parameters')}
        </h3>
      </div>

      <div className="space-y-3">
        {parametersSchema.map((param) => {
          const currentValue = values[param.id as keyof TParams] ?? param.defaultValue;
          return (
            <Slider
              key={param.id}
              id={param.id}
              label={getLocalizedText(param.label)}
              value={currentValue}
              min={param.min}
              max={param.max}
              step={param.step}
              unit={param.unit}
              onChange={(val) => onChange(param.id as keyof TParams, val)}
            />
          );
        })}
      </div>
    </Card>
  );
}

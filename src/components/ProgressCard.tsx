
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressCardProps {
  title: string;
  value: number; // 0 to 100
  description?: string;
  icon?: React.ReactNode;
  color?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  description,
  icon,
  color = 'stroke-brand'
}) => {
  const progressCircle = useRef<SVGCircleElement>(null);
  
  useEffect(() => {
    if (progressCircle.current) {
      const radius = progressCircle.current.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      
      // Calculate the stroke-dashoffset value based on the percentage
      const offset = circumference - (value / 100) * circumference;
      
      // Set the CSS custom property
      document.documentElement.style.setProperty('--progress-value', `${offset}`);
    }
  }, [value]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-6 pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {icon && (
            <div className="text-brand opacity-80">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <div className="flex items-center gap-4">
          <div className="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" />
              <circle
                ref={progressCircle}
                cx="50"
                cy="50"
                r="45"
                className={`progress ${color}`}
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-bold text-2xl fill-current"
              >
                {value}%
              </text>
            </svg>
          </div>
          
          <div className="flex-1">
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;

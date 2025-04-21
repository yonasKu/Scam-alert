"use client";

interface ScoreDistributionProps {
  distribution: Record<string, number>;
}

export default function ScoreDistribution({ distribution }: ScoreDistributionProps) {
  // Get the maximum count for scaling
  const maxCount = Math.max(...Object.values(distribution), 1);
  
  // Score ranges to display
  const scoreRanges = ['0-2', '2-4', '4-6', '6-8', '8-10'];
  
  // Get color based on range
  const getRangeColor = (range: string) => {
    switch(range) {
      case '0-2': return 'hsl(var(--success))';
      case '2-4': return 'hsl(var(--success) / 0.7)';
      case '4-6': return 'hsl(var(--warning))';
      case '6-8': return 'hsl(var(--warning) / 0.7)';
      case '8-10': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  };

  return (
    <div>
      <h3 style={{ 
        fontSize: '1rem', 
        fontWeight: '600', 
        marginBottom: '0.75rem',
        color: 'hsl(var(--foreground))'
      }}>
        Score Distribution
      </h3>
      <div style={{ 
        display: 'flex', 
        height: '120px',
        alignItems: 'flex-end',
        gap: '4px',
        marginBottom: '0.5rem'
      }}>
        {scoreRanges.map(range => {
          const count = distribution[range] || 0;
          const percentage = (count / maxCount) * 100;
          const color = getRangeColor(range);
          
          return (
            <div key={range} style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ 
                width: '100%',
                height: `${percentage}%`,
                backgroundColor: color,
                borderRadius: '4px 4px 0 0',
                minHeight: count > 0 ? '10px' : '0',
                position: 'relative'
              }}>
                {count > 0 && (
                  <div style={{ 
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {count}
                  </div>
                )}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                marginTop: '0.5rem',
                color: 'hsl(var(--muted-foreground))'
              }}>
                {range}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'hsl(var(--muted-foreground))',
        marginTop: '0.5rem'
      }}>
        <div>Low Risk</div>
        <div>Medium Risk</div>
        <div>High Risk</div>
      </div>
    </div>
  );
}

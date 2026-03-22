import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ChartComponent = dynamic(
  () =>
    import('recharts').then(mod => ({
      default: mod.ResponsiveContainer,
    })),
  {
    loading: () => (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading chart...</span>
      </div>
    ),
    ssr: false,
  }
);

export default ChartComponent;


import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-primary">
      <Loader2 className="w-12 h-12 animate-spin" />
    </div>
  );
}

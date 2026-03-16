import APICard, { APICardProps } from './api-card';

interface APIGridProps {
  apis: APICardProps['api'][];
}

export default function APIGrid({ apis }: APIGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apis.map((api) => (
        <APICard key={api.id} api={api} />
      ))}
    </div>
  );
}

import { MultipleContainers } from '@/components/dnd/MultipleContainers';

export default function Index() {
  return (
    <div className="p-10 flex flex-col h-full gap-9">
      <MultipleContainers
        // containerStyle={{ marginBottom: '2.5rem' }}
        scrollable={true}
      />
    </div>
  );
};

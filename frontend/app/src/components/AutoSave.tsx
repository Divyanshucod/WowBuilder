import { useAutoSave } from './AutoSaveContext';

export const AutoSave = () => {
  const { savingCount, error, lastSavedAt } = useAutoSave();

  const render = () => {
    if (savingCount > 0) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          Saving…
        </div>
      );
    }
    if (error) {
      return <div className="text-sm text-red-500">Save error</div>;
    }
    if (lastSavedAt) {
      return <div className="text-sm text-green-500">Saved</div>;
    }
    return <div className="text-sm text-gray-400">Idle</div>;
  };

  return (
    <div className="px-2 py-1">
      {render()}
    </div>
  );
};

export default AutoSave;

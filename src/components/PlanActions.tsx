interface PlanActionsProps {
  hasPlan: boolean;
  canCreate: boolean;
  onGenerate: () => void;
  onRegenerate: () => void;
}

export default function PlanActions({
  hasPlan,
  canCreate,
  onGenerate,
  onRegenerate,
}: PlanActionsProps): JSX.Element {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {!hasPlan ? (
        <button type="button" className="ui-btn px-4 py-2 text-sm font-medium" onClick={onGenerate} disabled={!canCreate}>
          生成计划
        </button>
      ) : (
        <button
          type="button"
          className="ui-btn px-4 py-2 text-sm font-medium"
          onClick={onRegenerate}
          disabled={!canCreate}
        >
          重新生成计划
        </button>
      )}
      {!canCreate ? <p className="self-center text-sm text-[#666666]">请至少选择一个训练部位</p> : null}
    </div>
  );
}

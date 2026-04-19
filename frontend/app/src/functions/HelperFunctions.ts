export function isWorkflowLoaded(): boolean {
  return !!localStorage.getItem("workflow_registry");
}
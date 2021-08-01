import VestTest from 'VestTest';
import ctx from 'ctx';

export function useRunnable(initialState: VestTest) {
  const [, setHooks] = useHooks();
  const cursorAt = useCursorAt();
  const currentHook = useHookAtCursor();

  if (!currentHook) {
    setHooks(hooks => {
      const nextHooks = hooks.concat();
      nextHooks[cursorAt] = initialState;
      return nextHooks;
    });
  }

  setNextCursorAt();

  return useHookAtCursor();
}

function useHookAtCursor(): VestTest {
  const cursorAt = useCursorAt();
  const [hooks] = useHooks();

  return hooks[cursorAt];
}

export function useRunnableValues(): VestTest[] {
  const [hooks] = useHooks();
  return hooks;
}

export function clearRunnableCache(): void {
  const [, setHooks] = useHooks();

  setHooks(hooks => hooks.slice());
}

function setNextCursorAt() {
  useSetCursorAt(ctx.useX().runnables.cursorAt + 1);
}

function useCursorAt(): number {
  return ctx.useX().runnables.cursorAt;
}

function useSetCursorAt(nextCursorAt: number): number {
  return (ctx.useX().runnables.cursorAt = nextCursorAt);
}

export function resetCursorAt() {
  useSetCursorAt(0);
}

function useHooks() {
  return ctx.useX().runnables.hooks();
}

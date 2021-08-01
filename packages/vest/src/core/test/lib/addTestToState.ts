import VestTest from 'VestTest';
import { useTestsOrdered } from 'stateHooks';

/**
 * Stores test object inside suite state.
 */
export default (testObject: VestTest): void => {
  const [, setTestObjects] = useTestsOrdered();
  setTestObjects(testObjects => testObjects.concat(testObject));
};

import { Model } from 'objection';

export function resolveModel<T extends Model>(modelPromise: Promise<any>): () => Promise<T> {
  return () => modelPromise.then(model => model.default);
}

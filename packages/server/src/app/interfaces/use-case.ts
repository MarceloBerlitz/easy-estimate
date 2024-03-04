export interface UseCase<T, Y> {
  execute(payload: T): Y;
}

export interface IdService {
  generate(): string;
  validate(id: string): boolean;
}

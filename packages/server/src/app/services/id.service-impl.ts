import { v4 as uuidv4, validate } from 'uuid';

export class IdServiceImpl {
  public generate(): string {
    return uuidv4();
  }

  public validate(uuid: string): boolean {
    return validate(uuid);
  }
}

import { v4 as uuidv4, validate } from 'uuid';
import { IdService } from '../interfaces/id.service';

export class IdServiceImpl implements IdService {
  public generate(): string {
    return uuidv4();
  }

  public validate(uuid: string): boolean {
    return validate(uuid);
  }
}

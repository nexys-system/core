import * as T from './type';

export const ddl = (ddlComplete: T.DdlInput[]): T.Ddl[] =>
  ddlComplete.map(entity => {
    const fields = entity.fields.map(f => {
      return { name: f.name, type: f.type };
    });

    const isUuid: boolean = entity.uuid || false;

    if (isUuid) {
      fields.push({ name: 'uuid', type: 'String' });
    } else {
      fields.push({ name: 'id', type: 'Int' });
    }

    return {
      name: entity.name,
      fields
    };
  });

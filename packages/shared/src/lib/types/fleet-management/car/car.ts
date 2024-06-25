import { DeepReadonly } from 'json-schema-to-ts/lib/types/type-utils/readonly';
import { FromSchema } from 'json-schema-to-ts';
import {
  makeValueObject,
  ValueObjectRuntimeInfo,
} from '@event-engine/messaging/value-object';
import { Writable } from 'json-schema-to-ts/lib/types/type-utils';
import definitions from '@app/shared/types/definitions';
import { references } from '@app/shared/types/references';
import { CarSchema } from './car.schema';
import { CarUiSchema } from './car.ui-schema';
import { CarDesc } from './car.desc';
import jexl from '@app/shared/jexl/get-configured-jexl';

export type Car = DeepReadonly<
  FromSchema<typeof CarSchema, { references: references }>
>;

export const car = makeValueObject<Car>(
  CarDesc.name,
  CarSchema as Writable<typeof CarSchema>,
  definitions,
  (data: any): Car => {
    const ctx: any = {};
    ctx['data'] = data;

    return ctx['data'] as Car;
  }
);

export const FleetManagementCarCarVORuntimeInfo: ValueObjectRuntimeInfo = {
  desc: CarDesc,
  factory: car,
  schema: CarSchema,
  uiSchema: CarUiSchema,
};

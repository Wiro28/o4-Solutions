export const GetCarSchema = {
  type: 'object',
  properties: {
    vehicleId: {
      type: 'string',
      format: 'uuid',
      title: 'Vehicle Id',
    },
  },
  required: ['vehicleId'],
  additionalProperties: false,
  title: 'Get Car',
} as const;

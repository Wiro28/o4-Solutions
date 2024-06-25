export const AddCarToFleetUiSchema = {
  vehicleId: {
    'ui:disabled': "!isRole(user, 'Admin')",
  },
} as const;

export const CarListUiSchema = {
  table: {
    columns: [
      {
        field: 'vehicleId',
      },
      {
        field: 'carName',
        value: "row.brand + ' ' + row.model",
        pageLink: 'CarDetails',
      },
      {
        field: 'productionYear',
      },
    ],
  },
} as const;

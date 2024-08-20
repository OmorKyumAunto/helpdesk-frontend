export const DetailsView = ({
  title,
  value,
}: {
  title: string;
  value: number | string | undefined;
}) => {
  return (
    <div className="invoice-information-section">
      <p className="info-title">{title}</p>
      <p className="info-value">
        <span className="font-semibold">:</span>
        <span>{value}</span>
      </p>
    </div>
  );
};

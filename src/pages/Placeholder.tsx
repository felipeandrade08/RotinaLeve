type PlaceholderProps = {
  title: string;
  description: string;
};

function Placeholder({
  title,
  description,
}: PlaceholderProps) {
  return (
    <div className="page placeholder-page">
      <span className="section-eyebrow">ROTINALEVE</span>
      <h1>{title}</h1>
      <p>{description}</p>

      <div className="coming-soon">
        🚀 Esta área será construída nas próximas etapas.
      </div>
    </div>
  );
}

export default Placeholder;
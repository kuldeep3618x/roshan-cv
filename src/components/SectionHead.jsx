export default function SectionHead({ kicker, title }) {
  return (
    <div className="section-head">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
    </div>
  );
}

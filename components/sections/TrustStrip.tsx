const attributes = [
  "Produtos selecionados",
  "Qualidade técnica",
  "Atendimento especializado",
  "Entrega para todo o Brasil",
];

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Atributos da Adapta Prime">
      <div className="shell trust-strip__track">
        {attributes.map((attribute) => (
          <p key={attribute}>
            <span aria-hidden="true" />
            {attribute}
          </p>
        ))}
      </div>
    </section>
  );
}


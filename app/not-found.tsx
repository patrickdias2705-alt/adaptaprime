import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="shell">
        <p className="eyebrow eyebrow--light">Página não encontrada</p>
        <h1>O caminho mudou.<br />A precisão continua.</h1>
        <p>Esta página não está disponível. Volte ao início ou consulte nosso catálogo institucional.</p>
        <div><Link href="/" className="button-link button-link--primary"><span>Voltar ao início</span><span aria-hidden="true">↗</span></Link><Link href="/produtos" className="button-link button-link--secondary"><span>Ver catálogo</span><span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>
  );
}


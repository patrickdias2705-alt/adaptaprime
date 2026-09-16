import Link from "next/link";
import { categories } from "@/lib/categories";
import { getWhatsAppUrl, navigation, siteConfig } from "@/lib/site-config";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  const year = new Date().getFullYear();
  const footerOrigin = "Rodapé > Atendimento";
  const footerWhatsappHref = getWhatsAppUrl({
    origin: footerOrigin,
    request: "Quero iniciar uma conversa com a equipe da Adapta Prime.",
  });
  const footerWhatsappExternal = footerWhatsappHref.startsWith("http");

  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div className="site-footer__brand">
          <BrandLogo />
          <p>
            Distribuidora especializada em soluções para Implantodontia,
            Endodontia e componentes odontológicos.
          </p>
        </div>

        <div className="footer-column">
          <p className="footer-label">Navegação</p>
          {navigation.slice(0, 5).map((item) => (
            <Link key={item.label} href={item.href}>{item.label}</Link>
          ))}
        </div>

        <div className="footer-column">
          <p className="footer-label">Soluções</p>
          {categories.slice(0, 4).map((category) => (
            <Link key={category.slug} href={`/solucoes/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <p className="footer-label">Atendimento</p>
          <Link
            href={footerWhatsappHref}
            target={footerWhatsappExternal ? "_blank" : undefined}
            rel={footerWhatsappExternal ? "noreferrer" : undefined}
            data-whatsapp-cta="true"
            data-lead-stage="discovery"
            data-lead-source={footerOrigin}
          >
            Atendimento comercial
          </Link>
          {siteConfig.email ? <a href={`mailto:${siteConfig.email}`}>E-mail</a> : null}
          {siteConfig.instagram ? <a href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram</a> : null}
        </div>
      </div>

      <div className="shell site-footer__bottom">
        <p>© {year} Adapta Prime. Todos os direitos reservados.</p>
        <div>
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>
          <Link href="/termos-de-uso">Termos de Uso</Link>
        </div>
      </div>
    </footer>
  );
}

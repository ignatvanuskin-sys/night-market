import { ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="nm-site nm-not-found">
      <header className="nm-header">
        <Link className="nm-brand" href="/" aria-label="NIGHT MARKET home"><span>NIGHT<br /><em>MARKET</em></span></Link>
        <Link className="nm-text-button" href="/">← Вернуться в каталог</Link>
      </header>
      <main className="nm-error-screen" id="top">
        <p className="nm-eyebrow">NIGHT MARKET / 404</p>
        <h1>Этой страницы<br /><i>нет в архиве.</i></h1>
        <p>Похоже, ссылка свернула не туда. Вернитесь к объектам или напишите оператору в Telegram.</p>
        <div className="nm-error-actions">
          <Link className="nm-cta" href="/"><Search size={17} /> Открыть каталог <ArrowLeft size={17} /></Link>
          <a className="nm-underlink" href="https://t.me/eloquncy" target="_blank" rel="noreferrer">Связаться с @eloquncy <ArrowUpRight size={15} /></a>
        </div>
      </main>
    </div>
  );
}


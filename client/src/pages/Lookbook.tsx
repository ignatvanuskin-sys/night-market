import { ArrowDownRight, ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

// Style reminder: Lookbook extends Occult Luxury Editorial with asymmetric spreads,
// archival captions, and orange action signals over dark museum-like imagery.
const assets = {
  hero: "/manus-storage/night-market-hero_485b5b3c.jpg",
  category: "/manus-storage/night-market-category_8cf4445d.jpg",
  raven: "/manus-storage/night-market-product-raven-hour_a1841730.jpg",
  nocturne: "/manus-storage/night-market-product-nocturne_5122c3a8.jpg",
  mark: "/manus-storage/night-market-mark_021c3289.png",
};

const looks = [
  { number: "01", title: "The threshold", note: "A silhouette for rooms that keep their own hours.", image: assets.raven, products: "Raven Hour / Acid Moon" },
  { number: "02", title: "Low flame", note: "Objects that make the air feel considered.", image: assets.category, products: "Black Fig / Ember Ritual" },
  { number: "03", title: "A quiet witness", note: "Leave one beautiful thing where it can watch.", image: assets.nocturne, products: "Nocturne / The Last Séance" },
];

export default function Lookbook() {
  return <div className="nm-site nm-lookbook"><header className="nm-header"><Link className="nm-brand" href="/" aria-label="NIGHT MARKET home"><img src={assets.mark} alt="" /><span>NIGHT<br /><em>MARKET</em></span></Link><nav className="nm-nav" aria-label="Primary navigation"><Link href="/">Catalog</Link><a href="#looks">Collections</a><a href="#editorial-note">About</a></nav><Link className="nm-text-button" href="/">← Back to market</Link></header><main>
    <section className="nm-look-hero"><div><p className="nm-kicker"><span className="nm-dot" /> Lookbook / issue 04</p><h1>Make the<br /><i>room</i> strange.</h1><p className="nm-hero-lede">Three arrangements for the hours after the obvious. Objects, texture and silhouette in a quieter register.</p><a className="nm-cta" href="#looks">Enter the lookbook <ArrowDownRight size={18} /></a></div><div className="nm-look-hero-image"><img src={assets.hero} alt="A glowing obsidian talisman in a dark editorial setting" /><span>NM / 04<br /><b>FIELD NOTES</b></span></div></section>
    <section id="looks" className="nm-look-list">{looks.map((look, index) => <article className={`nm-look ${index % 2 ? "nm-look-reverse" : ""}`} key={look.number}><div className="nm-look-image"><img src={look.image} alt={`${look.title} editorial arrangement`} /><span>{look.number} / 03</span></div><div className="nm-look-copy"><p className="nm-eyebrow">{look.products}</p><h2>{look.title}</h2><p>{look.note}</p><Link className="nm-underlink" href="/">Shop the objects <ArrowUpRight size={15} /></Link></div></article>)}</section>
    <section id="editorial-note" className="nm-look-note"><img src={assets.mark} alt="" /><div><p className="nm-eyebrow">A note from the archive</p><h2>Good atmosphere<br /><i>is useful.</i></h2><p>We build each look around one anchor object, then let texture and shadow do the rest. Nothing here is filler. If it changes the room, it belongs.</p><Link className="nm-underlink" href="/">Return to the market <ArrowLeft size={15} /></Link></div></section>
  </main><footer className="nm-footer"><Link className="nm-brand" href="/"><img src={assets.mark} alt="" /><span>NIGHT<br /><em>MARKET</em></span></Link><p>Objects for after dark.</p><div><Link href="/">Catalog</Link><a href="#looks">Lookbook</a><a href="mailto:hello@nightmarket.example">Contact</a></div><small>© 2026 NIGHT MARKET.</small></footer><div className="nm-noise" aria-hidden="true" /></div>;
}

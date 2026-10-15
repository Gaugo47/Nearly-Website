import Image from "next/image";
import { sitePath } from "./site";

export default function BlogVisual({ slug }: { slug: string }) {
  if (slug === "relation-a-distance-conseils") {
    return <div className="blog-visual blog-visual--distance" aria-hidden="true"><Image src={sitePath("/media/couple-twilight.png")} alt="" width={1586} height={992} /><span className="blog-visual__sticker">Même de loin.</span><span className="blog-visual__spark">✦</span></div>;
  }
  if (slug === "rituels-questions-couple") {
    return <div className="blog-visual blog-visual--ritual" aria-hidden="true"><span className="blog-visual__spark">✳</span><div className="blog-visual__question"><span>Une question à deux</span><strong>Quel petit moment<br />t’a fait sourire ?</strong><i>♡</i></div><span className="blog-visual__bubble">Moi, c’était toi.</span></div>;
  }
  if (slug === "garder-le-lien-amis-distance") {
    return <div className="blog-visual blog-visual--friends" aria-hidden="true"><div className="blog-visual__orbit" /><div className="blog-visual__avatars"><span>☺</span><span>☺</span><span>☺</span></div><span className="blog-visual__sticker">Toujours dans la bande.</span><span className="blog-visual__spark">✳</span></div>;
  }
  if (slug === "organiser-soiree-frais-amis") {
    return <div className="blog-visual blog-visual--party" aria-hidden="true"><span className="blog-visual__dice">⚄</span><div className="blog-visual__ticket"><span>La soirée est à nous</span><strong>3 amis.<br />90 €.<br />0 prise de tête.</strong></div><span className="blog-visual__spark">✦</span></div>;
  }
  const family = slug === "meilleures-applications-famille";
  const friends = slug === "meilleures-applications-amis";
  return <div className={`blog-visual blog-visual--apps ${family ? "blog-visual--family" : friends ? "blog-visual--group" : "blog-visual--couple"}`} aria-hidden="true"><span className="blog-visual__spark">✦</span><div className="blog-visual__phone"><Image src={sitePath(family ? "/media/app-famille.jpg" : friends ? "/media/app-amis.jpg" : "/media/app-accueil.jpg")} alt="" width={393} height={758} /></div><div className="blog-visual__app-icon"><Image src={sitePath("/media/nearly-app-icon-liquid-glass-v2.png")} alt="" width={128} height={128} /></div><span className="blog-visual__sticker">{family ? "Votre petit monde." : friends ? "La bande, réunie." : "Votre espace à deux."}</span></div>;
}

import type { BlogArticle } from "./blog-content";
import { sitePath } from "./site";
import BlogCard from "./BlogCard";

type Props = {
  title: string;
  steps: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  articles: BlogArticle[];
  /** The other free tools, so a visitor who finished one always has a next step. */
  tools: { label: string; href: string }[];
};

// What follows a tool: how it works, the questions people ask about it, and where to go next.
export default function ToolGuide({ title, steps, faqs, articles, tools }: Props) {
  return (
    <>
      <section className="tool-guide" aria-labelledby="tool-guide-title">
        <div className="tool-guide__how">
          <p className="eyebrow"><span /> Mode d’emploi</p>
          <h2 id="tool-guide-title">{title}</h2>
          <ol>{steps.map((step, index) => <li key={step.title}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
        </div>
        <div className="tool-guide__faq" id="questions">
          <p className="eyebrow"><span /> On vous répond</p>
          <h2>Questions fréquentes</h2>
          <div className="faq-list">{faqs.map((faq, index) => <details key={faq.question}><summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<i aria-hidden="true">+</i></summary><p>{faq.answer}</p></details>)}</div>
        </div>
      </section>
      <section className="blog-related tool-reading" aria-labelledby="tool-reading-title">
        <p className="eyebrow">Pour continuer</p>
        <h2 id="tool-reading-title">À lire ensuite.</h2>
        <div className="blog-grid">{articles.map(article => <BlogCard article={article} key={article.slug} />)}</div>
        <p className="tool-reading__tools">Autres essais gratuits : {tools.map(tool => <a href={sitePath(tool.href)} key={tool.href}>{tool.label} <span aria-hidden="true">↗</span></a>)}</p>
      </section>
    </>
  );
}

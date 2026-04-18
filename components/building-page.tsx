"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LiftedTitle } from "@/components/lifted-title";
import { formatMonthYear, type SiteContent } from "@/lib/site-data";

type BuildingPageProps = {
  content: SiteContent;
};

export function BuildingPage({ content }: BuildingPageProps) {
  const [tab, setTab] = useState<"resume" | "stockspektra" | "wisdom">("resume");
  const wisdomPosts = useMemo(
    () => content.blogs.filter((blog) => blog.cat === "tech" || blog.cat === "thoughts"),
    [content.blogs]
  );

  return (
    <div className="page-fade page-padded">
      <section className="section shell">
        <div className="section-kicker">Building</div>
        <h1 className="page-title">My work life</h1>
        <div className="lead-box">
          <p>{content.settings.bio}</p>
        </div>
        <div className="tabs">
          <button
            type="button"
            className={tab === "resume" ? "active" : ""}
            onClick={() => setTab("resume")}
          >
            Resume
          </button>
          <button
            type="button"
            className={tab === "stockspektra" ? "active" : ""}
            onClick={() => setTab("stockspektra")}
          >
            StockSpektra
          </button>
          <button
            type="button"
            className={tab === "wisdom" ? "active" : ""}
            onClick={() => setTab("wisdom")}
          >
            Wisdom
          </button>
        </div>
        {tab === "resume" ? <ResumeTab content={content} /> : null}
        {tab === "stockspektra" ? <StockSpektraTab content={content} /> : null}
        {tab === "wisdom" ? <WisdomTab titles={wisdomPosts} /> : null}
      </section>
    </div>
  );
}

function ResumeTab({ content }: { content: SiteContent }) {
  return (
    <div className="tab-body">
      <div className="subsection">
        <div className="section-kicker">Education</div>
        {content.education.map((education) => (
          <article key={education.school} className="edu-card">
            <h3>{education.school}</h3>
            <p className="edu-sub">
              {education.deg} - {education.sub}
            </p>
            <p className="edu-meta">
              {education.when} - GPA: {education.gpa}
            </p>
            <div className="chip-row">
              {education.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="subsection">
        <div className="section-kicker">Experience</div>
        <div className="timeline">
          {content.experience.map((experience) => (
            <article
              key={`${experience.co}-${experience.role}`}
              className={`timeline-item ${experience.side === "left" ? "left" : "right"} ${
                experience.pri ? "priority" : ""
              }`}
            >
              <h3>{experience.co}</h3>
              <p className="timeline-meta">
                <span>{experience.role}</span> - {experience.when} - {experience.where}
              </p>
              <ul>
                {experience.hl.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
      <div className="subsection">
        <div className="section-kicker">Skills</div>
        <div className="skills-grid">
          {Object.entries(content.skills).map(([category, values]) => (
            <article key={category} className="skill-card">
              <h4>{category}</h4>
              <p>{values.join(", ")}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function StockSpektraTab({ content }: { content: SiteContent }) {
  return (
    <div className="tab-body">
      <article className="project-card">
        <h3>{content.project.title}</h3>
        <p className="project-kicker">{content.project.subtitle}</p>
        <p className="project-copy">{content.project.description}</p>
        <div className="chip-row">
          {content.project.techStack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="stats-grid">
          {content.project.stats.map((stat) => (
            <article key={stat.l}>
              <small>{stat.l}</small>
              <p>{stat.v}</p>
            </article>
          ))}
        </div>
      </article>
    </div>
  );
}

function WisdomTab({ titles }: { titles: SiteContent["blogs"] }) {
  return (
    <div className="tab-body">
      {titles.map((blog) => (
        <Link key={blog.slug} className="blog-row" href={`/blog/${blog.slug}`}>
          <small>{blog.cat}</small>
          <LiftedTitle text={blog.title} as="h3" />
          <p>{blog.ex}</p>
          <span>{formatMonthYear(blog.date)}</span>
        </Link>
      ))}
    </div>
  );
}

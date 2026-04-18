"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { type SearchItem } from "@/lib/site-data";

type SearchOverlayProps = {
  onClose: () => void;
  items: SearchItem[];
};

export function SearchOverlay({ onClose, items }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return items.slice(0, 6);
    }
    return items
      .filter((item) =>
        `${item.title} ${item.subtitle} ${item.keywords?.join(" ") ?? ""}`
          .toLowerCase()
          .includes(value)
      )
      .slice(0, 8);
  }, [items, query]);

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(event) => event.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts, galleries, and projects"
        />
        <p>Try: varanasi, stockspektra, wildlife</p>
        <div className="search-results">
          {results.length > 0 ? (
            results.map((item, index) => (
              <Link key={`${item.title}-${index}`} href={item.path} onClick={onClose}>
                <small>{item.kind}</small>
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </Link>
            ))
          ) : (
            <div className="empty-search">No matches found.</div>
          )}
        </div>
      </div>
      <button type="button" className="search-close" onClick={onClose} aria-label="Close Search">
        X
      </button>
    </div>
  );
}

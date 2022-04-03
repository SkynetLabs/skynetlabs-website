import * as React from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

export function NewsSummary({ avatar, author, date }) {
  const authorName = author || "Skynet Labs";
  const isOrg = authorName === "Skynet Labs";

  return (
    <div className="flex space-x-4">
      {avatar && <GatsbyImage image={getImage(avatar)} alt={authorName} className="rounded-full" />}
      <div className="flex flex-col text-xs justify-around h-10">
        <div
          className="text-palette-600"
          itemScope
          itemProp="author"
          itemType={`http://schema.org/${isOrg ? "Organization" : "Person"}`}
        >
          <span itemProp="name">{authorName}</span>
        </div>
        {date && <div className="text-palette-400">{date}</div>}
      </div>
    </div>
  );
}

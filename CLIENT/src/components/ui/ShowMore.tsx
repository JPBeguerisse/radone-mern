import React, { useState } from "react";

interface ShowMoreProps {
  children: React.ReactNode;
  maxLines?: number;
}

const ShowMore: React.FC<ShowMoreProps> = ({ children, maxLines = 3 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={`${
          expanded ? "" : `line-clamp-${maxLines}`
        } whitespace-pre-line break-words`}
      >
        {children}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-gray-700 font-semibold hover:underline mt-1"
      >
        {expanded ? "Voir moins" : "Voir plus"}
      </button>
    </div>
  );
};

export default ShowMore;
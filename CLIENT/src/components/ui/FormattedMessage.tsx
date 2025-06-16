// src/components/ui/FormattedMessage.tsx
import React from "react";

type Props = {
  message: string | "cool";
};

export const FormattedMessage: React.FC<Props> = ({ message }) => {
  return (
    <>
      {message.split("\n").map((line, index) => (
        <p key={index} className="whitespace-pre-line break-words">
          {line.split(/(\s+)/).map((word, i) => {
            if (word.trim().startsWith("#")) {
              return (
                <span key={i} className="text-blue-500 font-semibold">
                  {word}
                </span>
              );
            } else {
              return <span key={i}>{word}</span>;
            }
          })}
        </p>
      ))}
    </>
  );
};

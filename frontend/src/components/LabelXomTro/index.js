import React from "react";

export default function LabelXomTro(props) {
  const { label, subLabel, fontSize, rFontSize, heightOfLine } = props;
  return (
    <>
      <div className="w-full lg:w-fit relative mb-4">
        <div
          // className={`absolute left-0 w-1 bg-green-400 ${
          //   subLabel ? "h-16" : "h-10"
          // }`}
          className={`absolute left-0 w-1 bg-green-400 ${heightOfLine}`}
        ></div>
        <div className="flex-none flex-shrink-0 ml-3">
          <h2
            className={`font-sans font-semibold text-${fontSize} lg:text-${rFontSize} font-heading`}
          >
            {label}
          </h2>
          <span className="font-sans text-sm italic">{subLabel}</span>
        </div>
      </div>
    </>
  );
}

import React from "react";
import "../App.css";

/**
 * @param {Object} param
 * @param {string[]} param.byteArray
 */
export const ByteCodeContainer = ({ byteArray }) => (
  <div className="bytecode-container">
    {byteArray.map((byteCode, index) => (
      <div key={byteCode + index} className="bytecode-element">
        {byteCode}
      </div>
    ))}
  </div>
);

import React, { useEffect, useState } from "react";
import SliderDetails from "../SliderDetails";
import VerifyPostDetails from "./VerifyPostDetails";

export default function Header() {
  return (
    <div className="flex flex-col lg:flex-row">
      <SliderDetails />
      <VerifyPostDetails />
    </div>
  );
}

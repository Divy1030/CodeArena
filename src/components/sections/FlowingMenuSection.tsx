"use client";

import React from "react";
import FlowingMenu from "@/components/bits/FlowingMenu";
import { flowingMenuData } from "@/data/menuData";

export default function FlowingMenuSection() {
  return (
    <section className="bg-black h-screen">
      <FlowingMenu items={flowingMenuData} />
    </section>
  );
}
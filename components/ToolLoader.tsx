"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Client-side map from tool name to its code. Each import() becomes its own chunk that only the
 * page showing that tool downloads. (When the server component imported every tool directly,
 * webpack put all of them in one ~200 KB chunk that every tool page loaded.)
 */
const COMPONENTS = {
  DocResizer: dynamic(() => import("./tools/DocResizer")),
  AgeCalculator: dynamic(() => import("./tools/AgeCalculator")),
  PdfCompress: dynamic(() => import("./tools/PdfCompress")),
  ImagesToPdf: dynamic(() => import("./tools/ImagesToPdf")),
  PdfMerge: dynamic(() => import("./tools/PdfMerge")),
  PassportSheet: dynamic(() => import("./tools/PassportSheet")),
  ImageConvert: dynamic(() => import("./tools/ImageConvert")),
  ImageStudio: dynamic(() => import("./tools/ImageStudio")),
  ImageToText: dynamic(() => import("./tools/ImageToText")),
  BulkResize: dynamic(() => import("./tools/BulkResize")),
  TypingTest: dynamic(() => import("./tools/TypingTest")),
  AnswerKey: dynamic(() => import("./tools/AnswerKey")),
  MyForms: dynamic(() => import("./tools/MyForms")),
  Countdown: dynamic(() => import("./tools/Countdown")),
  ResumeMaker: dynamic(() => import("./tools/ResumeMaker")),
  BiodataMaker: dynamic(() => import("./tools/BiodataMaker")),
  LetterMaker: dynamic(() => import("./tools/LetterMaker")),
} as const;

export type ToolComponent = keyof typeof COMPONENTS;

export default function ToolLoader({ name, props }: { name: ToolComponent; props: Record<string, unknown> }) {
  const C = COMPONENTS[name] as ComponentType<Record<string, unknown>>;
  return <C {...props} />;
}

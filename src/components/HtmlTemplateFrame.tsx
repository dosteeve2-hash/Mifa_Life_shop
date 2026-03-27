"use client";

import { useEffect, useRef, useState } from "react";

type HtmlTemplateFrameProps = {
  html: string;
  title: string;
};

export function HtmlTemplateFrame({ html, title }: HtmlTemplateFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(1200);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }

    const updateHeight = () => {
      const frameDocument = iframe.contentDocument;
      if (!frameDocument) {
        return;
      }

      const nextHeight = Math.max(
        frameDocument.documentElement.scrollHeight,
        frameDocument.body?.scrollHeight ?? 0,
        window.innerHeight,
      );

      setHeight(nextHeight);
    };

    const handleLoad = () => {
      updateHeight();
      const frameWindow = iframe.contentWindow;
      frameWindow?.addEventListener("resize", updateHeight);
    };

    iframe.addEventListener("load", handleLoad);
    const timer = window.setTimeout(updateHeight, 250);

    return () => {
      window.clearTimeout(timer);
      iframe.removeEventListener("load", handleLoad);
      iframe.contentWindow?.removeEventListener("resize", updateHeight);
    };
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title={title}
      srcDoc={html}
      sandbox="allow-forms allow-same-origin allow-scripts"
      className="block w-full border-0 bg-transparent"
      style={{ height }}
    />
  );
}

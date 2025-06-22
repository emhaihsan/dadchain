"use client";

import { useEffect, useRef } from "react";
import { toSvg } from "jdenticon";

interface IdenticonProps {
  address: string;
  size: number;
  className?: string;
}

export function Identicon({ address, size, className }: IdenticonProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = toSvg(address, size);
    }
  }, [address, size]);

  return <div ref={ref} className={className} />;
}

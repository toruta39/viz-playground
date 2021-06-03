import React, { useRef, useEffect } from "react";

export default function useD3(
  renderFn: () => void,
  dependencies: React.DependencyList
) {
  const ref = useRef();

  useEffect(renderFn, dependencies);

  return ref;
}

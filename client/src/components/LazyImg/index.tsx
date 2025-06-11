import React, { useEffect, useRef, useState } from "react";

import "./index.less";

interface LazyImgProps {
  src: string;
  alt: string;
  lazy?: boolean;
  className?: string;
  placeholder?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export function LazyImg({
  src,
  alt,
  lazy = true,
  className = "",
  placeholder = null,
  errorFallback = null,
}: LazyImgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<IntersectionObserver | null>(null);

  // 初始化状态
  useEffect(() => {
    setIsVisible(!lazy);
    setHasError(false);
  }, [src, lazy]);

  // 如果不是懒加载模式，立即设置为可见
  useEffect(() => {
    if (!lazy) {
      setIsVisible(true);
    }
  }, [lazy]);

  useEffect(() => {
    if (!lazy || isVisible || !containerRef.current) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        imgRef.current?.disconnect();
      }
    };

    imgRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.01,
    });

    imgRef.current.observe(containerRef.current);

    return () => {
      imgRef.current?.disconnect();
    };
  }, [lazy, isVisible, src]);

  // 清除观察器
  useEffect(() => {
    return () => {
      imgRef.current?.disconnect();
    };
  }, []);

  const showImage = isVisible && !hasError;
  const showPlaceholder = !showImage && !hasError;
  const showError = hasError && errorFallback;

  return (
    <div
      ref={containerRef}
      className={`lazy-img-container ${className}`}
      data-visible={isVisible}>
      {showImage && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setHasError(false)}
          onError={() => setHasError(true)}
          className="lazy-img"
        />
      )}

      {showPlaceholder && placeholder}
      {showError && errorFallback}
    </div>
  );
}

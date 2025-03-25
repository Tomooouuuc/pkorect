"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  pictureList: RESPONSE.Pictrue[];
  renderItem: (picture: RESPONSE.Pictrue) => React.ReactNode;
  onLoadMore: (id: number) => void;
  hasMore?: boolean;
}

const PictureLayout: React.FC<Props> = ({
  pictureList,
  renderItem,
  onLoadMore,
  hasMore = true,
}) => {
  const [cols, setCols] = useState(6);
  const [colList, setColList] = useState(
    Array.from({ length: cols }, () => new Array<RESPONSE.Pictrue>())
  );
  const [lastPicture, setLastPicture] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCols = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const newCols = Math.max(1, Math.floor(containerWidth / 200));
      setCols(newCols);
    };

    const observer = new ResizeObserver(updateCols);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    updateCols();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || lastPicture === -1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading) {
          onLoadMore(lastPicture);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 100px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, lastPicture]);

  useEffect(() => {
    const getColList = () => {
      setIsLoading(true);

      const tmpColList = Array.from(
        { length: cols },
        () => new Array<RESPONSE.Pictrue>()
      );
      const heights = new Array(cols).fill(0);
      pictureList.forEach((picture) => {
        var minIndex = 0;
        for (var i = 0; i < heights.length; i++) {
          if (heights[i] < heights[minIndex]) {
            minIndex = i;
          }
        }
        tmpColList[minIndex].push(picture);
        heights[minIndex] += 1.0 / picture.picScale;
      });
      setColList(tmpColList);

      if (pictureList.length > 0) {
        setLastPicture(pictureList[pictureList.length - 1].id);
      } else {
        setLastPicture(-1);
      }
      setIsLoading(false);
    };
    getColList();
  }, [cols, pictureList]);

  return (
    <div className="picture_layout">
      <div
        ref={containerRef}
        style={{ width: "100%", display: "flex", gap: "16px" }}
      >
        {colList.map((col, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {col.map((picture) => renderItem(picture))}
          </div>
        ))}
      </div>
      <div ref={sentinelRef} style={{ height: "1px" }} />
      {isLoading && (
        <div style={{ textAlign: "center", padding: "20px" }}>加载中...</div>
      )}
    </div>
  );
};

export default PictureLayout;

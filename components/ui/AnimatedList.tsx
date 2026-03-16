"use client";
import React, {
  useState, useEffect, useRef,
  ReactNode, HTMLAttributes, Children
} from "react";

interface AnimatedListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  showGradient?: boolean;
  className?: string;
  itemClassName?: string;
}

interface AnimatedListItemProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  key?: any;
}

export function AnimatedListItem({
  children,
  className = "",
  style = {},
}: AnimatedListItemProps) {
  return (
    <div
      className={className}
      style={{
        animation: "slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function AnimatedList({
  children,
  delay = 40,
  showGradient = true,
  className = "",
  itemClassName = "",
  ...props
}: AnimatedListProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef<any>(null);

  const childrenArray = Children.toArray(children);

  useEffect(() => {
    setVisibleCount(0);
    let count = 0;
    const show = () => {
      count++;
      setVisibleCount(count);
      if (count < childrenArray.length) {
        timerRef.current = setTimeout(show, delay);
      }
    };
    timerRef.current = setTimeout(show, 0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [childrenArray.length, delay]);

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {childrenArray.slice(0, visibleCount).map((child: any, i: number) => (
        <AnimatedListItem
          key={i}
          className={itemClassName}
          style={{ animationDelay: "0ms" }}
        >
          {child}
        </AnimatedListItem>
      ))}

      {showGradient && (
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "32px",
            background:
              "linear-gradient(to top, #0d1117, transparent)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

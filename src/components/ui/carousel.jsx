import React, { useState, useEffect } from 'react';

const slides = [
  '졸음 감지로 사고를 예방하는 렌터카 안전 솔루션',
  '운전자 상태와 차량을 한눈에 모니터링',
  '비용은 낮추고, 효율은 높이는 경제적 시스템',
];

export function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-transparent">
      <div className="flex h-full items-center justify-center text-lg font-semibold">
        <p>{slides[currentSlide]}</p>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`block h-2 w-2 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

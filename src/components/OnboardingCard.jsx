import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import carsafety from '../assets/carsafety.json';
import monitor from '../assets/monitor.json';
import growth from '../assets/growth.json';

export default function OnboardingCard() {
  const cards = [
    {
      text: '졸음 감지로 사고를 예방하는<br>렌터카 안전 솔루션',
      animation: carsafety,
    },
    {
      text: '운전자 상태와 차량을<br>한눈에 모니터링',
      animation: monitor,
    },
    {
      text: '비용은 낮추고, 효율은 높이는<br>경제적 시스템',
      animation: growth,
    },
  ];

  const renderTextWithLineBreaks = (text) =>
    text.split(/<br>/).map((line, idx) => (
      <span key={idx}>
        {line}
        <br />
      </span>
    ));

  const [currentIndex, setCurrentIndex] = useState(0);
  const total = cards.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex h-[600px] w-full max-w-lg flex-col items-center justify-center px-6 py-8 text-center">
      <div className="mb-10 flex gap-3">
        {cards.map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'bg-cornflower-500 w-8'
                : 'bg-cornflower-200 w-3'
            }`}
          />
        ))}
      </div>

      <Lottie
        animationData={cards[currentIndex].animation}
        loop
        className="mb-6 h-48"
      />
      <p className="text-cornflower-950 justify-center text-center text-2xl leading-snug font-bold md:text-3xl">
        {renderTextWithLineBreaks(cards[currentIndex].text)}
      </p>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handlePrev}
          className="text-cornflower-950 hover:bg-cornflower-100 hover:text-cornflower-600 inline-flex items-center justify-center rounded-xl p-2 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="text-cornflower-950 hover:bg-cornflower-100 hover:text-cornflower-600 inline-flex items-center justify-center rounded-xl p-2 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

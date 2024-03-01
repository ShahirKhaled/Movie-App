import { useState, useEffect, useRef } from "react";
import "./MoviesCarousel.css";
import MovieInfo from "../MovieInfo";
import { useFetchMovie } from "../../Global";

export default function MoviesCarousel() {
  const [localData, localDataLoading] = useFetchMovie();
  const [data, loading] = useFetchMovie("trending/all/day");
  const [hasUserClicked, setHasUserClicked] = useState(true);
  const [initialTouchPosition, setInitialTouchPosition] = useState(0);
  const [previousTranslateValue, setPreviousTranslateValue] = useState(0);
  const [currentTranslateValue, setCurrentTranslateValue] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slideContainer = useRef();

  useEffect(() => {
    if (!loading && !localDataLoading && hasUserClicked) {
      const interval = setInterval(() => next(), 5000);
      return () => clearInterval(interval);
    }
  });

  useEffect(translateBasedOnSlideIndex, [currentSlideIndex]);

  function prev() {
    setHasUserClicked(false);
    setCurrentSlideIndex((previousState) =>
      currentSlideIndex > 0 ? previousState - 1 : data.length - 1
    );
  }

  function next() {
    setCurrentSlideIndex((previousState) =>
      currentSlideIndex < data.length - 1 ? previousState + 1 : 0
    );
  }

  function touchStart(e) {
    setInitialTouchPosition(e.touches[0].clientX);
    e.currentTarget.style.transitionDuration = "0s";
  }

  function touchMove(e) {
    const currentPosition = e.touches[0].clientX;
    setCurrentTranslateValue(
      previousTranslateValue + currentPosition - initialTouchPosition
    );
  }

  function touchEnd(e) {
    const displacementAmount = currentTranslateValue - previousTranslateValue;
    e.currentTarget.style.transitionDuration = "200ms";

    if (displacementAmount < -100 && currentSlideIndex < data.length - 1)
      setCurrentSlideIndex((previousState) => previousState + 1);
    else if (displacementAmount > 100 && currentSlideIndex > 0) {
      setCurrentSlideIndex((previousState) => previousState - 1);
      setHasUserClicked(false);
    } else translateBasedOnSlideIndex();
  }

  function translateBasedOnSlideIndex() {
    const value = slideContainer.current
      ? -slideContainer.current.clientWidth
      : 0;
    setCurrentTranslateValue(currentSlideIndex * value);
    setPreviousTranslateValue(currentSlideIndex * value);
  }

  if (loading || localDataLoading) return <MovieInfo />;

  return (
    <section className="slideshow-parent">
      <button onClick={prev} id="prev-button">
        &#8656;
      </button>
      <button onClick={next} id="next-button">
        &#8658;
      </button>
      <div
        className="slide-container"
        onTouchStart={touchStart}
        onTouchMove={touchMove}
        onTouchEnd={touchEnd}
        ref={slideContainer}
        style={{ transform: `translateX(${currentTranslateValue}px)` }}
      >
        {data.map((item, index) => {
          const isLocal = localData.some(
            (localElem) => item.id === localElem.id
          );
          return (
            <MovieInfo
              isLocal={isLocal}
              key={(item.title || item.name) + index}
              data={item}
            />
          );
        })}
      </div>
      <div className="dots">
        {data.map((item, index) => {
          return (
            <div
              key={(item.title || item.name) + index}
              className={`dot${index === currentSlideIndex ? " active" : ""}`}
              onClick={() => setCurrentSlideIndex(index)}
            ></div>
          );
        })}
      </div>
    </section>
  );
}

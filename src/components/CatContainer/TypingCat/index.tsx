import React, { FC, useEffect } from "react";
import TypingCatSvg from './TypingCatSvg'
import './DrawSVGPlugin3'
import gsap from "gsap";

interface TypingCatProps {
}

const Index: FC<TypingCatProps> = (props: TypingCatProps) => {
  const {} = props;
  const catTyping = ()=>{
    const ID = "bongo-cat";
    const s = (selector:string) => `#${ID} ${selector}`;
    const notes = document.querySelectorAll(".note");

    for (let note of notes) {
      note?.parentElement?.appendChild(note.cloneNode(true));
      note?.parentElement?.appendChild(note.cloneNode(true));
    }

    const music = { note: s(".music .note") };
    const cat = {
      pawRight: {
        up: s(".paw-right .up"),
        down: s(".paw-right .down"),
      },
      pawLeft: {
        up: s(".paw-left .up"),
        down: s(".paw-left .down"),
      },
    };

    gsap.set(music.note, { scale: 0, autoAlpha: 1 });

    const animatePawState = (selector:string) =>
      gsap.fromTo(
        selector,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.001,
          repeatDelay: 0.19,
          yoyo: true,
          repeat: -1,
        }
      );

    const tl = gsap.timeline();

    tl.add(animatePawState(cat.pawLeft.up), "start")
      .add(animatePawState(cat.pawRight.down), "start")
      .add(animatePawState(cat.pawLeft.down), "start+=0.19")
      .add(animatePawState(cat.pawRight.up), "start+=0.19")
      .timeScale(1.6);

    gsap.from(".terminal-code line", {
      drawSVG: "0%",
      duration: 0.1,
      stagger: 0.1,
      ease: "none",
      repeat: -1,
    });

// typing for pipe function doesn't seem to be working for usage when partially applied?
    const noteElFn = gsap.utils.pipe(gsap.utils.toArray, gsap.utils.shuffle);
    const noteEls= noteElFn(music.note);

    const numNotes = noteEls.length / 3;
    const notesG1 = noteEls.splice(0, numNotes);
    const notesG2 = noteEls.splice(0, numNotes);
    const notesG3 = noteEls;

    const colorizer = gsap.utils.random(["#a5ea9b", "#ff61d8", "#569cfa", "#ffcc81", "#7ed1e2", "#a3a4ec", "#67b5c0", "#fd7c6e"], true);
    const rotator = gsap.utils.random(-50, 50, 1, true);
    const dir = (amt:number) => `${gsap.utils.random(["-", "+"])}=${amt}`;

    const animateNotes = (els: HTMLElement[]) : GSAPTween=> {
      els.forEach((el) => {
        gsap.set(el, {
          stroke: colorizer(),
          rotation: rotator(),
          x: gsap.utils.random(-25, 25, 1),
        });
      });

      return gsap.fromTo(
        els,
        {
          autoAlpha: 1,
          y: 0,
          scale: 0,
        },
        {
          duration: 2,
          autoAlpha: 0,
          scale: 1,
          ease: "none",
          stagger: {
            from: "random",
            each: 0.5,
          },
          rotation: dir(gsap.utils.random(20, 30, 1)),
          x: dir(gsap.utils.random(40, 60, 1)),
          y: gsap.utils.random(-200, -220, 1),
          // @ts-ignore
          onComplete: () => animateNotes(els),
        }
      );
    };

    // @ts-ignore
    tl.add(animateNotes(notesG1)).add(animateNotes(notesG2), ">0.05").add(animateNotes(notesG3), ">0.25");
  }
  useEffect(() => {
    catTyping()
  }, []);
  return (
    <div className="typing-cat" >
      <TypingCatSvg />
    </div>
  );
};
export default Index;

---
title: 'Go-Synth — First sound!'
date: '2022-01-03'
pubDate: '2022-01-03'
category: 'learn'
description: ''
heroImage: '../../../../assets/images/te.jpg'
tags:
  - 'go'
  - 'golang'
  - 'oscillator'
  - 'saw'
  - 'synth'
---

> Find the related code in the branch [blog/001-simple-saw-oscillator](https://github.com/malparty/go-synth/tree/blog/001-simple-saw-oscillator)

The only rule I have set for this project was: "it has to sound good and since the beginning!".

So instead of building a whole structure, UI, and other things, I will first build a sound and then extends its properties.

Normal developers would create a base architecture to welcome chromatic notes to adjust the frequency, a voltage control, the oscillator, and eventually an envelope system.

Well, that's NOT how I will plan this project. I have 2 priorities:

- A SAW oscillator — because saw shape is damn good!
- A reverb effect — who want a synth with no reverb?!

Yesterday, I was so happy as I could code the Saw Oscillator right the first time! Or did I? Let's see that.

How do we even design a sound oscilloscope?

```
func OscFunc(stat float64, delta float64) float64 {
  // Do something and return the current shape level
  return r
}
```

If you have experience in Game Development, this will sound familiar. As for game movements, to ensure the "speed" of rendering the sound (or the movement) is NOT affected by the speed of your CPU, we need to work with delta increments.

That is, instead of describing the next position every millisecond, we describe the next position after a `delta` time. This time is the time elapsed since the previous description.

You can imagine a loop that calls our OscFunc every time the CPU can afford to do so. As the frequency to call this function might vary, we need to integrate the "delta" of time elapsed when we shape our sound.

My first attempt was pretty basic, but the generated sounds immediately told me "IT WORKS"!

```
func SawFunc(stat float64, delta float64) float64 {
  _, r := math.Modf(stat + delta)
  return r
}
```

Yeah, it's just an addition! The `math.Modf` ensures that we only take values between 0 and 1:  
`math.Modf(0.5) == 0.5`

`math.Modf(1.5) == 0.5`

`math.Modf(1.15) == 0.15`

`math.Modf(2) == 0`

`math.Modf(2.3) == 0.`3

It was only after I observed a record of that sound, I realized that I still messed up a detail: Wave should oscillate from -1 to 1, not from 0 to 1!

![](https://malparty.cluster010.ovh.net/wp-content/uploads/2022/01/image-3-1024x240.png)

It just required a minor code change to fix it and have a perfect SAW oscillator that would serve as base sound for the next challenges of this project!

```
func SawFunc(stat float64, delta float64) float64 {
  _, r := math.Modf(stat + delta)
  return r*2.0 - 1.0
}
```

![](https://malparty.cluster010.ovh.net/wp-content/uploads/2022/01/image-2-1024x269.png)

Okay! Now it's working like a charm! Time to write some tests and I can close this topic!

> Many challenges on this project will NOT be test driven. Indeed, my aim is to have fun and to explore possibilities, I do not expect a predictable result for a given feature and I totally allow myself to change the expectations based on what I discover on my way. Tests enables to stay in a given way, so I would only write tests when I found which way I want the feature to take.

That's it for today! See ya for the next one!

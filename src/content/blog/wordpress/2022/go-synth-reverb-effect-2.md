---
title: 'GO SYNTH — REVERB EFFECT #2'
date: '2022-01-16'
pubDate: '2022-01-16'
category: 'learn'
description: ''
heroImage: '../../../../assets/images/te.jpg'
tags:
  - 'design'
  - 'effect'
  - 'go'
  - 'golang'
  - 'reverb'
  - 'sound'
  - 'synth'
---

After the [previous failure](https://malparty.cluster010.ovh.net/2022/01/go-synth-reverb-effect/), I decided to document myself at a minimum. I mainly used [this article](https://medium.com/the-seekers-project/coding-a-basic-reverb-algorithm-an-introduction-to-audio-programming-d5d90ad58bde) from [Rishikesh Daoo](https://medium.com/@rishikesh.daoo). I might consider reading some of his other articles as it's quite insightful!

This basically told me that a nice ratio can be reached with 4 buffers that delay at different rates the sound.

So while I kept the previous algorithm, I just duplicated it 4 times with different offsets to the main delay offset. So instead of having only 1x repetition fading progressively, we have 4 of them:

<figure>

![](https://malparty.cluster010.ovh.net/wp-content/uploads/2022/01/image-7-1024x286.png)

<figcaption>

0 is the original sound shape, {1,2,3,4} are each different delays that will repeat several times (b, c,...) while progressively adding. Note that 4c is the **tiny** jump.

</figcaption>

</figure>

By adjusting the delays time, we can get an "acceptable reverb effect" that covers very different types of reverb:

![](https://malparty.cluster010.ovh.net/wp-content/uploads/2022/01/image-4-1024x430.png)

When the delay time is just under the signal frequency, we get a reversed delay (like if the reverb was applied from right to left). This transforms the shape of the resulting sound (as it reduces the "saw" effect):

![](https://malparty.cluster010.ovh.net/wp-content/uploads/2022/01/image-5-1024x384.png)

I'm quite happy with this result, it can be found in the [blog/002-reverb-effect branch](https://github.com/malparty/go-synth/tree/blog/002-reverb-effect) of my project.

Next, I will probably add a UI so that testing sound can be more interactive. This is important as my aim is not to build a synth following the theory only, but more to explore sound design while building my synth. Soon too, I will need an envelope (and so a Voltage Control Oscillator) and midi assignments... Not sure in which order this will happen :D

Until then, stay safe and curious!

---
title: 'Go Synth — Reverb Effect'
date: '2022-01-03'
pubDate: '2022-01-03'
category: 'learn'
description: ''
heroImage: '../../../../assets/images/te.jpg'
tags:
  - 'effect'
  - 'go'
  - 'golang'
  - 'reverb'
  - 'synth'
---

> Find the related code in the branch [002-reverb-effect](https://github.com/malparty/go-synth/tree/blog/002-reverb-effect)

On my way to have fun, a reverb is more important than the actual capability to play different notes :D

So I gave it a try, without reading documentation. I want to challenge my capabilities to reverse engineer a reverb.

So a reverb effect is similar to the change of your voice you can hear when you are in a big hall or a church. It is not a "delay" — that echo of your voice from a distant mountain, you know? It is much shorter.

My first assumption was: If I can create a buffer and apply a small percent of the oldest part of this buffer to the sound, I would offset this small percentage and it should be working... Or is it?

After some tweaks to ensure the reverb effect is also applied in the reverb buffer, I got the expected result:

![](https://malparty.cluster010.ovh.net/wp-content/uploads/2022/01/image-1024x269.png)

My main oscillator is a SAW, so it should normally just go up and then reset to `-1`. With the reverb effect applied, we can see an offset repetition and fade every time it gets repeated.

So visually, it is a WIN! 🎉

...well... until you realize it just does not sound like a reverb effect... at all! At best I got a short time vibrato when changing the frequency... Hum... NOT APPROVED!

My next tentative is to store in the buffer ONLY the reverberation (and not the final oscillation level). This way, I can have 2 different rates. I can apply a 20% rate on the first reverb calculation and then make a 95% rate on the reverb itself. This will enable the reverb effect to last longer.

Indeed, in the previous picture, we can see the reverb effect fade too quickly — that is my hypothesis why we just do not hear it much 🤔

![](https://malparty.cluster010.ovh.net/wp-content/uploads/2022/01/image-1-1024x264.png)

That's somehow a little bit better... But definitely does not sound like a reverb!

I will have to start documenting myself a little big I guess...

See ya for the next one!

![Experience: my face became a meme | Life and style | The Guardian](https://i.guim.co.uk/img/media/3aab8a0699616ac94346c05f667b40844e46322f/0_123_5616_3432/master/5616.jpg?width=700&quality=85&auto=format&fit=max&s=a476da702aff265ce6f586be1412b1e1)

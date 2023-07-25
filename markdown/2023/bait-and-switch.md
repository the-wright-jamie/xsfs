# Bait and Switching Discord Users

Written by [the-wright-jamie](https://the-wright-jamie.dev/) on 29th March 2023, updated 25th July 2023

<span class="material-symbols-rounded">Science</span> Part of the Experiment Write-Up series

## Introduction

The following is a real image which is being retrieved from an external server:

![Troll Image](https://troll.xsfs.xyz/troll.png)

Don't believe that this is your real IP address? <https://whatismyipaddress.com/>  
Of course, if you're using a VPN, this won't be your IP address but an IP address belonging to the VPN

But when we send this image into a Discord server, we get this:  
![Discord Image](https://xsfs.xyz/assets/img/2023/discord-bait.png)

## How does this work?

Well, you can read the code [here](https://github.com/the-wright-jamie/Image-Troll-Server) and see for yourself, but the code doesn't reveal the full story - so keep reading to learn more about this.

Basically web servers don't have to serve static images. As long as they return the data with a specified MIME type the browser (or application, i.e. in this case Discord) will be able to render whatever it was that was sent to it. That means we can use simple web server frameworks, like NodeJS + Express, to interpret a request; modify an image; and then return the data the client is expecting.

## What is the intended path for the victim?

Due to the way Discord works, we need to present some bait to the user to get them to click to middle click the image (if they are viewing this on desktop), or "Open in browser" (if they on any other device). This will redirect them to a new tab in their browser which will then display their IP address to them (which you saw above).

So basically `User sees (bait) image` ➜ `User opens in browser` ➜ `User gets pranked`

## Why do we need to use bait?

You may be thinking the reason we need to use bait is to get around moderators in servers immediately deleting the images, but actually, it's a little more complicated than that. TL;DR, Discord presents a cached version of the image to the user.

The long answer: to understand why we need bait, we need to understand how Discord handles images. Here is the basic process for how an image is displayed to a user in Discord:

1. A user sends the link to the image
2. A Discord crawler crawls the link to see what it is (`crawl-{crawler-ip-address}.ptr.discord.com`)
3. The crawler sees that it's an image, and hands it off to the caching server (`{undetermined-ip-address}.bc.googleusercontent.com`)
4. The caching server reads the image
5. The image is saved in the background in chat as linking to something like `https://images-ext-1.discordapp.net/external/{some-encoding}/{link-to-original-image}`
6. That replacement cache image is what is displayed to the user

Hopefully, you can see where the issue is coming from here - the cached image is what's displayed, not the original image.

If the caching server retrieves the image on the user's behalf, the IP address that's going to get displayed is the caching server's IP and not the target's IP address and as a result killing the punchline 🫤. In a way, it would work for a brief moment - someone seeing it might get freaked out until they actually check on Google what their IP address is, but actually presenting the user's IP address to them is a lot more effective.

So, instead, we need to detect if a data centre is accessing our image and if it is, give the data centre the bait to display instead as this is what will be displayed to the user in Discord. And remember, the end goal is to get the user to open the image in the browser so we can lift the user's actual IP address.

![Connections Diagram](https://xsfs.xyz/assets/img/2023/discord-bait-graphic.png)

## Why is Discord like this?

It's anyone's guess why Discord does it like this. However, we could probably relate it to the Information Security CIA Triad:

![CIA Triad](https://xsfs.xyz/assets/img/2023/cia-triad.svg)

1. **Confidentiality**: Preventing people like me from doing something like this easily as someone could easily collect a large amount of real user IP addresses this way if there was no cache/proxy and no one could stop us
2. **Integrity**: make sure it doesn't change - it's the same as when it was posted (although this doesn't entirely line up as the image is cached when it's loaded on the client's side and not when the actor posts it, it also occasionally updates it's cache too)
3. **Availability**: Imagine the image linked to a small server in someone's attic and it got posted in a large server. The image being posted there and many users accessing the image at once with Discord open in the background could simply DDOS the host. Or simply, the original endpoint's server may have slow internet

Probably some other reasons like:

4. Scanning the image for malicious content (malware, content that is against the TOS/Guidelines)
5. Reducing their bandwidth impact on the host (related to point 3)

## Conclusion

In this article, we have learnt how people are able to pull off these kind of pranks. The process used by the server to figure out if a cache server is accessing the image is somewhat rudimentary, but it works for the purposes we are using here. It could be improved for other services, for example GitHub uses a similar system - so if you wanted to use this broadly, you'd have to change it to have a better detection of caching servers. In reality, you'd have to know what websites a services use cache in this way.

This was an interesting dip into how Discord handles images, and I hope you were also able to learn something new from this article. I encourage you to go out and explore for yourself, just don't do something that could get you in trouble!
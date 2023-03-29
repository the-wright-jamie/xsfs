# Bait and Switching Discord Users

Written by [the-wright-jamie](https://the-wright-jamie.dev/) on 29th March 2023

## Introduction

The following is a real image which is being retrieved from an external server:  
![You've been trolled!](https://troll.the-wright-jamie.dev/troll.png)  
Don't believe that this is your your real IP address? <https://whatismyipaddress.com/>  
Of course, if you're using a VPN, this won't be your IP address but an IP address belonging to the VPN

But when we send this image into a Discord server, we get this:  
![Discord Image](https://xsfs.xyz/assets/img/2023/discord-bait.png)

## How does this work?

Well, you can read the code [here](https://github.com/the-wright-jamie/Image-Troll-Server) and see for yourself, but the code doesn't reveal the full story - so keep reading to learn more about this.

Basically, however, web servers don't have to serve static images, as long as they return the data with a specified MIME type the browser (or application, i.e. in this case Discord) will be able render whatever it was that was sent to it. That means we can use simple web server frameworks, like NodeJS + Express, to interpret a request; modify an image; and then return the data the client is expecting.

## What is the intended path for the victim?

Due to the way Discord works, we need to present some bait to the user to get them to click "Open in browser" which will then display their IP address to them

## Why do we need to use bait?

You may be thinking the reason we need to use bait is to get around moderators in servers immediately deleting the images, but actually it's a little more complicated that that. TL;DR, Discord presents a cached version of the image to the user.

The long answer: to understand why we need bait, we need to understand how Discord handles images. Here is the basic process for how an image is displayed to a user in Discord:

1. A user sends the link to the image
2. A Discord crawler crawls the link to see what it is (`crawl-{crawler-ip-address}.ptr.discord.com`)
3. The crawler sees that it's an image, and hands off to the caching server (`{undetermined-ip-address}.bc.googleusercontent.com`)
4. The caching server reads the image
5. The image is saved in the background in chat as linking to something like `https://images-ext-1.discordapp.net/external/{some-encoding}/{link-to-original-image}`
6. That replacement cache link is what is actually displayed to the user

Hopefully you can see where the issue is coming in here: step 5.

If the caching server retrieves the image on the user's behalf, the IP address that's going to get displayed is the caching server's IP and not the target's IP address and as a result killing the punchline 🫤

So, instead, we need to detect if a data center is accessing our image and if it is, give the data center the bait to display instead as this is what will be displayed to the user in Discord. And remember, as a result of this, the end goal is to get the user to click "Open in Browser" in Discord, so that it will take them there and the browser will access the server directly so we can lift the user's actual IP address.

TODO: Create a diagram. Do you see this message? Get in touch with the creator of the article.

## Why is Discord like this?

It's anyone's guess why Discord does it like this. However, we could probably relate it back to the Information Security CIA Triad:

![CIA Triad](https://xsfs.xyz/assets/img/cia-triad.svg)

1. **Confidentiality**: Preventing people like me from doing something like this easily as someone could easily collect a large amount of real user IP addresses this way if there was no cache/proxy and no one could really stop us
2. **Integrity**: make sure it doesn't change - it's the same as when it was posted (although this doesn't entirely line up as the image is cached when it's loaded on the clients side and not when the actor posts it, it also occasionally updates it's cache too)
3. **Availability**: Imagine the image linked to a small server in someone's attic and it got posted in a large server. The image being posted there and that many users accessing the image at once with Discord open in the background could simply DDOS the host. Or simply, the original endpoint's server may have slow internet

Probably some other reasons like:

4. Scanning the image for malicious content (malware, content that is against the TOS/Guidelines)
5. Reducing their bandwidth impact on the host (related to point 3)

Additionally, nowadays it's a lot harder to pull this off due to this pop-up:
![Discord showing a warning about the true URL of the image that was posted](https://xsfs.xyz/assets/img/2023/discord-warning.png)

Especially considering the URL where this 'resource' is store, it's very on the nose and as a normal user seeing this you may think twice about opening the image in browser. I don't know if companies have been going this 'zero trust' route of external resources because of genuine concern for user safety or because they are just trying to mitigate user error (as it could be bad press if Discord doesn't do enough to protect it's users from themselves).

## What are the takeaways from this?

- For end users: always be careful opening and downloading anything. You would be very surprised how easy it is to obfuscate things. Computers are getting better at protecting you from yourself, much to the dismay of power users who very much want their computers to get out of the way.
- For developers:
  TODO: This. See this message? Let the creator of the article know.

This is the google code repository for **YouTube HD Ultimate**. All development and issue tracking occurs here. For the other information, reviews and general discussion, see this script's home on userscripts.org:

http://userscripts.org/scripts/show/31864

# Developers, Developers, Developers! #
This script is in need of extra developers, as the original author has little time to work on it. If you want to join, speak up or forever hold your peace!

# TODO #
These are major todo's for ythd:
  1. Implement perfect aspect ratio. Can be done by "canvas"'ing the hqdefault picture, and counting the black pixels before a non-black pixel (ex: http://i.ytimg.com/vi/GXRVX1AKAew/hqdefault.jpg?).
  1. Autobuffer intelligently based on the user's bandwidth. Final implementation should download enough to play the video all the way through without stopping.
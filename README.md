blah
====

IRC bot which imitates omegle functionality in an IRC network.

Dependencies
------------

    npm install irc

Usage
-----

### Bot setup

    node blah.js <address> <nick> <password>

* address - IRC server address
* nick - nickname of the bot (optional, defaults to 'blah')
* password - NickServ password for the nickname (optional)

### Bot usage

All interactions with the bot are done through PMs. 
* ~help - shows basic help text
* ~connect - attempts to connect to another person
* ~disconnect - disconnects current ongoing person

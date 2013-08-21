blah
====

IRC bot which imitates omegle functionality in an IRC network.

Dependencies
------------

    npm install irc

Usage
-----

### Bot setup

    node blah.js <address> <nick> <realname> <password>

* address - IRC server address
* nick - nickname of the bot (optional, defaults to 'blah')
* realname - realname of the bot, for networks where it's necessary to have owner's nickname there (optional, defaults to nick)
* password - NickServ password for the nickname (optional)

### Bot usage

All interactions with the bot are done through PMs. 
* ~help - shows basic help text
* ~connect - attempts to connect to another person
* ~disconnect - disconnects current ongoing person

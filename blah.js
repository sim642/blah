var irc = require('irc');


var myName = process.argv[3] || 'blah';
var bot = new irc.Client(process.argv[2], myName, {
	userName: myName,
	realName: myName,
	channels: []
});

var partners = {};
var nopartner = null;

bot.addListener('registered', function(message) {
	if (process.argv[4]) {
		bot.say('NickServ', 'identify ' + process.argv[4]);
	}
});

bot.addListener('pm', function(nick, text, message) {
	if (text[0] == '~') {
		var cmd = text.substr(1);
		switch (cmd) {
		case 'connect':
			if (nick in partners) {
				bot.say(nick, '\x02~~~already connected~~~');
			}
			else if (nopartner == nick) {
				bot.say(nick, '\x02~~~your are already waiting for partner~~~');
			}
			else if (nopartner !== null) {
				bot.say(nick, '\x02~~~you connected~~~');
				bot.say(nopartner, '\x02~~~partner connected~~~');
				partners[nick] = nopartner;
				partners[nopartner] = nick;
				nopartner = null;
				bot.send('WATCH', '+' + nick);
				console.log('%s <-> %s connected', nick, partners[nick]);
			}
			else {
				bot.say(nick, '\x02~~~waiting for partner~~~');
				nopartner = nick;
				bot.send('WATCH', '+' + nick);
				console.log('%s waiting', nick);
			}
			break;
		
		case 'disconnect':
			if (nick in partners) {
				bot.say(nick, '\x02~~~you disconnected~~~');
				bot.say(partners[nick], '\x02~~~partner disconnected~~~');
				bot.send('WATCH', '-' + nick, '-' + partners[nick]);
				console.log('%s >-< %s disconnected', nick, partners[nick]);
				delete partners[partners[nick]];
				delete partners[nick];
			}
			else if (nopartner == nick) {
				bot.say(nick, '\x02~~~you are not waiting for partner~~~');
				bot.send('WATCH', '-' + nick);
				nopartner = null;
				console.log('%s not waiting', nick);
			}
			else {
				bot.say(nick, '\x02~~~you are not connected~~~');
			}
			break;
		
		case 'help':
		default:
			bot.say(nick, 'I am an IRC bot through which you can talk to other people who are using this bot, anonymously.');
			bot.say(nick, 'Commands are: ~connect and ~disconnect');
			break;
		}
	}
	else {
		if (nick in partners) {
			bot.say(partners[nick], text);
			console.log('%s -> %s: %s', nick, partners[nick], text);
		}
		else {
			bot.say(nick, '\x02~~~not connected~~~ (say \'~help\' for help)');
		}
	}
});

bot.addListener('raw', function(message) {
	if (message.rawCommand == '601') { //WATCH user left
		var nick = message.args[1];
		
		if (nick in partners) {
			bot.say(partners[nick], '\x02~~~partner disconnected~~~');
			bot.send('WATCH', '-' + nick, '-' + partners[nick]);
			console.log('%s >-< %s disconnected', nick, partners[nick]);
			delete partners[partners[nick]];
			delete partners[nick];
		}
		else if (nopartner == nick) {
			bot.send('WATCH', '-' + nick);
			nopartner = null;
			console.log('%s not waiting', nick);
		}
	}
});


bot.addListener('error', function(message) {
	console.error(message);
});


/*bot.addListener('quit', function(nick, reason, channels, message) {
	if (nick in partners) {
		bot.say(partners[nick], '~~~partner disconnected~~~');
		delete partners[partners[nick]];
		delete partners[nick];
	}
	else if (nopartner == nick) {
		nopartner = null;
	}
});*/

/*bot.addListener('nick', function(oldnick, newnick, channels, message) {
	if (oldnick in partners) {
		partners[newnick] = partners[oldnick];
		partners[partners[oldnick]] = newnick;
		delete partners[oldnick];
	}
	else if (nopartner == oldnick) {
		nopartner = newnick;
	}
});*/


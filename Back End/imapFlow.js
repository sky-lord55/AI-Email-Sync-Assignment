const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const EventEmitter = require('events');

class ImapService extends EventEmitter {
  constructor(account) {
    super();
    this.imap = new Imap({
      user: account.user,
      password: account.password,
      host: account.host,
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });
  }

  start() {
    this.imap.once('ready', () => {
      this.imap.openBox('INBOX', true, (err, box) => {
        if (err) throw err;
        this.imap.on('mail', () => this.fetchNewEmails());
        this.fetchNewEmails()
      });
    });

    this.imap.once('error', (err) => console.error('IMAP error', err))
    this.imap.once('end', () => console.log('Connection ended'))
    this.imap.connect()
  }

  fetchNewEmails() {
    const sinceDate = new Date(Date.now() - 30 * 24 * 3600 * 1000)
    const searchCriteria = [['SINCE', sinceDate.toISOString()]]
    this.imap.search(searchCriteria, (err, results) => {
      if (err) return console.error(err);
      if (!results || results.length === 0) return
      const fetch = this.imap.fetch(results, { bodies: '', markSeen: false })
      fetch.on('message', (msg) => {
        msg.on('body', (stream) => {
          simpleParser(stream, (err, parsed) => {
            if (err) console.error(err)
            else this.emit('email', parsed)
          });
        });
      });
    });
  }
}

module.exports = ImapService

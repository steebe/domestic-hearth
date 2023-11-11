# domestic-hearth

A simple Google Chrome extension for mapping websites to a redirect, intended to help those that have a hard time avoiding the temptations of the open web.

<p align="center">
  <img src="./assets/enabled-128_128.png" alt="focus"/>
</p>

## Usage

To start leveraging the Hearth, publish any distracting website as a distraction, and map it to a replacement.

Distractions should be root-level site URLS, without protocol or `www` prefixed. Replacements must be fully qualified URLs so that the Chrome redirects can operate properly.

### Examples:

Replace all of Reddit with https://steebe.dev:

| distraction | replacement        |
| ----------- | ------------------ |
| reddit.com  | https://steebe.dev |

Replace only the root domain https://reddit.com with https://steebe.dev

| distraction        | replacement        |
| ------------------ | ------------------ |
| https://reddit.com | https://steebe.dev |

The difference in these examples is important. By specifying a protocol in the _distraction_, the URL redirection will only work when the browser visits https://reddit.com specifically, hence the advice above.

### Tools

- Chrome API
- [DALL-E 2](https://openai.com/dall-e-2) for generating the extension's icons
- [Online PNG Tools](https://onlinepngtools.com/resize-png) for editing the original images down to web sizes

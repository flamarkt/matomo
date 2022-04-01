# Matomo Analytics

Connects Flarum and Flamarkt to a Matomo Analytics server.

This extension can be used with or without Flamarkt installed.

## Installation

This extension will follow the future Flamarkt release cycles with possibly a few major `0.x` versions during the beta.
While this extension probably won't experience any significant change, manual operations might still be required between major versions.
For this reason I recommend using the `^` requirement (that's what the command below will use) and not `*`, so you don't accidentally update without reading this README in the future.

    composer require flamarkt/matomo

## Features

### Pages

The extension tracks initial page loads as well as navigation inside the Single Page App.

Additional logic is provided to correctly track page titles.
For those pages the tracking happens only after Flarum applies the title to the page instead of immediately after the first render of the component.

### Events

The following events are tracked:

| Category             | Action            | Name              |
| -------------------- | ----------------- | ----------------- |
| `DiscussionComposer` | `Open` or `Close` |                   |
| `ReplyComposer`      | `Open` or `Close` | \<discussion id\> |
| `EditPostComposer`   | `Open` or `Close` | \<post id\>       |

### Search

The search term is tracked every time a search is performed via Flarum search bar, even if the search page is not open.

### Outlinks

Outlinks are tracked on most pages and post content.

### E-Commerce

Will integrate with Flamarkt in a future version.

## Support

This extension is actively supported.
Please use the Flarum Discuss discussion to discuss features and report issues.

Please only create GitHub issues for bugs with reliable reproduction steps.

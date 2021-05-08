import {extend, override} from 'flarum/common/extend';
import Page from 'flarum/common/components/Page';
import ComposerState from 'flarum/forum/states/ComposerState';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';
import EditPostComposer from 'flarum/forum/components/EditPostComposer';
import DiscussionsSearchSource from 'flarum/forum/components/DiscussionsSearchSource';
import CommentPost from 'flarum/forum/components/CommentPost';
import SettingsPage from 'flarum/forum/components/SettingsPage';

/* global app, m, _paq, flarum */

app.initializers.add('flamarkt-matomo', () => {
    /**
     * Calls _paq.push() with the provided arguments if the _paq object exists
     */
    function paqPush() {
        if (typeof _paq !== 'undefined') {
            _paq.push(...arguments);
        }
    }

    let isFirstPage = true;

    /**
     * Takes care of the tracking of a page in the single page app
     * https://developer.matomo.org/guides/spa-tracking
     */
    function trackPageView() {
        // First page is already tracked by the Matomo script tag
        if (isFirstPage) {
            isFirstPage = false;
            return;
        }

        if (typeof _paq !== 'undefined') {
            paqPush(['setCustomUrl', m.route.get()]);
            paqPush(['setDocumentTitle', document.title.replace(/^\([0-9]+\) /), '']); // Title without the titleCount
            paqPush(['setGenerationTimeMs', 0]);
            paqPush(['trackPageView']);
            paqPush(['enableLinkTracking']);
        }
    }

    const componentsWithCustomTracking = {
        // The following components set the pageTitle in their oncreate method but after calling the parent oncreate
        // So we can't access it when just extending the parent Page
        'components/IndexPage': 'oncreate',
        'tags/components/TagsPage': 'oncreate',
        // The following components set the pageTitle only after the resource has been loaded
        'components/DiscussionPage': 'show',
        'components/UserPage': 'show',
        'components/SettingsPage': 'oninit',
    };

    Object.keys(componentsWithCustomTracking).forEach(componentName => {
        if (!flarum.core.compat.hasOwnProperty(componentName)) {
            console.warn('[flamarkt/matomo] Skipping missing component ' + componentName);
            return;
        }

        extend(flarum.core.compat[componentName].prototype, 'oninit', function () {
            // This tells the "fallback" tracking not to handle this page
            this.matomoCustom = true;
        });

        extend(flarum.core.compat[componentName].prototype, componentsWithCustomTracking[componentName], function () {
            // SettingsPage extends UserPage but sets the title in oninit *after* calling the parent show()
            // So in that situation we need to ignore the track in the parent and only do it in the child
            if (componentName === 'components/UserPage' && this instanceof SettingsPage) {
                return;
            }

            trackPageView();
        });
    });

    // We use oncreate instead of oninit because some page set their title during oncreate and we want the title
    extend(Page.prototype, 'oncreate', function (vdom) {
        if (this.matomoCustom) {
            return;
        }

        trackPageView();
    });

    extend(ComposerState.prototype, 'load', function (returnValue, componentClass, attrs) {
        if (componentClass === DiscussionComposer) {
            paqPush(['trackEvent', 'DiscussionComposer', 'Open']);
        } else if (componentClass === ReplyComposer) {
            paqPush(['trackEvent', 'ReplyComposer', 'Open', attrs.discussion.id()]);
        } else if (componentClass === EditPostComposer) {
            paqPush(['trackEvent', 'EditPostComposer', 'Open', attrs.post.id()]);
        }
    });

    override(ComposerState.prototype, 'hide', function (original) {
        if (this.body.componentClass === DiscussionComposer) {
            paqPush(['trackEvent', 'DiscussionComposer', 'Close']);
        } else if (this.body.componentClass === ReplyComposer) {
            paqPush(['trackEvent', 'ReplyComposer', 'Close', this.body.attrs.discussion.id()]);
        } else if (this.body.componentClass === EditPostComposer) {
            paqPush(['trackEvent', 'EditPostComposer', 'Close', this.body.attrs.post.id()]);
        }

        original.call(this);
    });

    extend(DiscussionsSearchSource.prototype, 'search', function (promise, query) {
        promise.then(() => {
            paqPush(['trackSiteSearch', query, 'Discussions', this.results[query].length]);
        });
    });

    // Takes care of link tracking in new posts being rendered when loading more on the discussion or profile page
    extend(CommentPost.prototype, 'oncreate', function () {
        paqPush(['enableLinkTracking']);
    });
});

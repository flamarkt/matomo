import Mithril from 'mithril';

declare global {
    const m: Mithril.Static;

    const _paq: string[][] | undefined

    interface FlarumExports {
        core: {
            compat: any,
        }
    }

    const flarum: FlarumExports
}

declare module 'flarum/common/Component' {
    export default interface Component {
        matomoCustom: boolean
    }
}

declare module 'flarum/forum/states/ComposerState' {
    export default class ComposerState {
        body: {
            componentClass: any
            attrs: any
        }
    }
}

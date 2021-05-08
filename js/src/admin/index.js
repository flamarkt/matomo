import Select from 'flarum/common/components/Select';

/* global app, m */

app.initializers.add('flamarkt-matomo', () => {
    app.extensionData.for('flamarkt-matomo')
        .registerSetting({
            setting: 'flamarkt-matomo.url',
            label: app.translator.trans('flamarkt-matomo.admin.settings.url'),
        })
        .registerSetting({
            setting: 'flamarkt-matomo.siteId',
            label: app.translator.trans('flamarkt-matomo.admin.settings.siteId'),
        })
        .registerSetting(function () {
            const trackAccountsSetting = this.setting('flamarkt-matomo.trackAccounts');

            if (!trackAccountsSetting()) {
                trackAccountsSetting('none');
            }

            return m('.Form-group', [
                m('label', app.translator.trans('flamarkt-matomo.admin.settings.trackAccounts')),
                Select.component({
                    options: {
                        none: app.translator.trans('flamarkt-matomo.admin.settings.trackAccountsOptions.none'),
                        username: app.translator.trans('flamarkt-matomo.admin.settings.trackAccountsOptions.username'),
                        email: app.translator.trans('flamarkt-matomo.admin.settings.trackAccountsOptions.email'),
                    },
                    value: trackAccountsSetting(),
                    onchange: trackAccountsSetting,
                }),
            ]);
        });
});

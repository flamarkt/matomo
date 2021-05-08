<?php

namespace Flamarkt\Matomo;

use Flarum\Extend;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Frontend('backoffice'))
        // Use same js for admin+backoffice so the settings are available on both sides
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->content(Content\AddTracking::class),

    new Extend\Locales(__DIR__ . '/resources/locale'),
];

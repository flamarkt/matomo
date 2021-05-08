<?php

namespace Flamarkt\Matomo\Content;

use Flamarkt\Matomo\Tracker;
use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Guest;
use Psr\Http\Message\ServerRequestInterface;

class AddTracking
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(Document $document, ServerRequestInterface $request)
    {
        $url = $this->settings->get('flamarkt-matomo.url');
        $siteId = $this->settings->get('flamarkt-matomo.siteId');

        if (!$url || !$siteId) {
            return;
        }

        $tracker = new Tracker($url, $siteId);

        $trackAccounts = $this->settings->get('flamarkt-matomo.trackAccounts');

        if (in_array($trackAccounts, ['username', 'email'])) {
            $user = $request->getAttribute('actor');

            if (!($user instanceof Guest)) {
                $tracker->setUserId($user->$trackAccounts);
            }
        }

        $document->head[] = $tracker->toHtml();
    }
}

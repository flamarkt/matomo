<?php

namespace Flamarkt\Matomo;

use Illuminate\Support\Str;

class Tracker
{
    protected $url;
    protected $siteId;
    protected $pushs = [];

    public function __construct(string $url, $siteId)
    {
        $this->url = $url;
        $this->siteId = $siteId;

        // Use protocol-relative url if no protocol is defined
        if (!Str::startsWith($this->url, ['http://', 'https://', '//'])) {
            $this->url = '//' . $this->url;
        }

        // Add trailing slash if not already present
        if (!Str::endsWith($this->url, '/')) {
            $this->url .= '/';
        }
    }

    public function addPush()
    {
        $this->pushs[] = func_get_args();
    }

    public function setUserId($id)
    {
        $this->addPush('setUserId', $id);
    }

    public function toHtml(): string
    {
        $html = '<script type="text/javascript">var _paq = _paq || [];';

        foreach ($this->pushs as $push) {
            $html .= '_paq.push([' . implode(',', array_map(function ($item) {
                    return json_encode($item);
                }, $push)) . ']);';
        }

        $html .= "_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u=" .
            json_encode($this->url) .
            ";_paq.push(['setTrackerUrl',u+'matomo.php']);" .
            ";_paq.push(['setSiteId'," . json_encode($this->siteId) . "]);" .
            "var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];" .
            "g.type='text/javascript';g.async=true;g.defer=true;g.src=u+'matomo.js';s.parentNode.insertBefore(g,s);" .
            "})();</script>";

        return $html;
    }
}

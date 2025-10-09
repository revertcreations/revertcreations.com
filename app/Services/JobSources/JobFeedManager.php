<?php

namespace App\Services\JobSources;

use App\Models\JobSource;
use App\Services\JobSources\Contracts\JobFeed;
use App\Services\JobSources\Drivers\RemotiveJobFeed;
use App\Services\JobSources\Drivers\RemoteOkJobFeed;
use App\Services\JobSources\Drivers\RssJobFeed;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Collection;
use InvalidArgumentException;

class JobFeedManager
{
    /**
     * @var array<string, class-string<JobFeed>>
     */
    private array $drivers;

    public function __construct(
        private readonly Container $container,
        array $customDrivers = []
    ) {
        $this->drivers = array_merge($this->defaultDrivers(), $customDrivers);
    }

    public function collect(JobSource $source): Collection
    {
        $driver = $this->resolveDriver($source->driver);

        return $driver->collect($source);
    }

    private function resolveDriver(?string $driverName): JobFeed
    {
        $driverName = $driverName ?: 'rss';

        $driverClass = $this->drivers[$driverName] ?? $this->drivers['rss'] ?? null;

        if (!$driverClass) {
            throw new InvalidArgumentException("No job feed driver registered for [{$driverName}].");
        }

        return $this->container->make($driverClass);
    }

    /**
     * @return array<string, class-string<JobFeed>>
     */
    private function defaultDrivers(): array
    {
        return [
            'remote_ok' => RemoteOkJobFeed::class,
            'remotive' => RemotiveJobFeed::class,
            'rss' => RssJobFeed::class,
            'we_work_remotely' => RssJobFeed::class,
            'remotejobs_io' => RssJobFeed::class,
            'flexjobs' => RssJobFeed::class,
            'nodesk' => RssJobFeed::class,
            'working_nomads' => RssJobFeed::class,
            'remote_com' => RssJobFeed::class,
            'jobspresso' => RssJobFeed::class,
        ];
    }
}

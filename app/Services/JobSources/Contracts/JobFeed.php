<?php

namespace App\Services\JobSources\Contracts;

use App\DataTransferObjects\JobListingData;
use App\Models\JobSource;
use Illuminate\Support\Collection;

interface JobFeed
{
    /**
     * @return Collection<int, JobListingData>
     */
    public function collect(JobSource $source): Collection;
}

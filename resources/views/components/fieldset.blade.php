<fieldset>
    <legend class="text-base font-medium text-gray-900">By Email</legend>
    <div class="mt-4 space-y-4">
        <div class="flex items-start">
            <div class="flex items-center h-5">
                <input id="comments" name="comments" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
            </div>
            <div class="ml-3 text-sm">
                <label for="comments" class="font-medium text-gray-700">Comments</label>
                <p class="text-gray-500">Get notified when someones posts a comment on a posting.</p>
            </div>
        </div>
        <div class="flex items-start">
            <div class="flex items-center h-5">
                <input id="candidates" name="candidates" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
            </div>
            <div class="ml-3 text-sm">
                <label for="candidates" class="font-medium text-gray-700">Candidates</label>
                <p class="text-gray-500">Get notified when a candidate applies for a job.</p>
            </div>
        </div>
        <div class="flex items-start">
            <div class="flex items-center h-5">
                <input id="offers" name="offers" type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
            </div>
            <div class="ml-3 text-sm">
                <label for="offers" class="font-medium text-gray-700">Offers</label>
                <p class="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
            </div>
        </div>
    </div>
</fieldset>
<fieldset>
    <div>
        <legend class="text-base font-medium text-gray-900">Push Notifications</legend>
        <p class="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p>
    </div>
    <div class="mt-4 space-y-4">
        <div class="flex items-center">
            <input id="push_everything" name="push_notifications" type="radio" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
            <label for="push_everything" class="ml-3 block text-sm font-medium text-gray-700">
                Everything
            </label>
        </div>
        <div class="flex items-center">
            <input id="push_email" name="push_notifications" type="radio" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
            <label for="push_email" class="ml-3 block text-sm font-medium text-gray-700">
                Same as email
            </label>
        </div>
        <div class="flex items-center">
            <input id="push_nothing" name="push_notifications" type="radio" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
            <label for="push_nothing" class="ml-3 block text-sm font-medium text-gray-700">
                No push notifications
            </label>
        </div>
    </div>
</fieldset>

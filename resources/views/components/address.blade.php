<div class="col-span-6 sm:col-span-3">
    <label for="country" class="block text-sm font-medium text-gray-700">Country / Region</label>
    <select name="country" autocomplete="country" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        @foreach($countries as $code => $name)
        <option value="{{ $code }}">{{ $name }}</option>
        @endforeach
    </select>
</div>

<div class="col-span-6">
    <label for="address1" class="block text-sm font-medium text-gray-700">Street address</label>
    <input type="text" name="address1" autocomplete="address" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
</div>

<div class="col-span-6">
    <label for="address2" class="block text-sm font-medium text-gray-700">Street address 2</label>
    <input type="text" name="address2" autocomplete="address2" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
</div>

<div class="col-span-6 sm:col-span-6 lg:col-span-2">
    <label for="city" class="block text-sm font-medium text-gray-700">City</label>
    <input type="text" name="city" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
</div>

<div class="col-span-6 sm:col-span-3">
    <label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
    <select name="state" autocomplete="state" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        @foreach($states as $code => $name)
        <option value="{{ $code }}" {{ $code == "NM" ? "selected" : ""}}>{{ $name }}</option>
        @endforeach
    </select>
</div>

<div class="col-span-6 sm:col-span-3 lg:col-span-2">
    <label for="postal-code" class="block text-sm font-medium text-gray-700">ZIP / Postal</label>
    <input type="text" name="postal-code" autocomplete="postal-code" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
</div>

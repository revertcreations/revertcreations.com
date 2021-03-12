<x-layout>

    <form id="proposal_form" method="POST">
        @method('put')
        @csrf

        <i class="mt-1 bg-gray-800 text-gray-200 text-5xl">Photoshoot Proposal</i>

        <div class="m-5  self-center justify-around flex flex-col md:flex-row">

            <div class="flex flex-col">

                <p class="m-5">
                    Hi there <span class=" underline font-bold text-lg">{{ $proposal->client->first_name }}</span>! Looks like we got some business to go over, how exciting!
                    Below you will see my proposal for the upcoming photoshoot that we have discussed. Feel free to edit any of the details below. Once you are happy
                    with the terms on your side, check the agreement checkbox below, and click the "I Agree" button. I'll be notified, and review all changes, if any. Once we both agree,
                    I'll send you an email a copy of the finalized agreement, along with pre-shoot invoices, if any.
                </p>

                <p class="m-5">
                    Thanks so much for the opportunity, and I look forward to creating just the perfect content with you!
                </p>
        <br>

        <i class="mt-1 bg-gray-300 text-3xl">Details &amp; Pricing</i>

        <div class="w-full m-5 self-center justify-around flex flex-col md:flex-row">

            <div class="flex flex-col">

                <label for="title">Photoshoot Name</label>
                <div>
                    <input name="title" class="w-full inline border-none mt-1 text-gray-800 font-bold text-2xl" type="text" value="{{ $proposal->title }}">
                </div>

                <label for="description">Brief Description</label>
                <div>
                    <textarea data-autoresize name="description" class="w-full  h-full inline border-none mt-1 text-gray-800 font-bold text-2xl" rows="6" cols="50" oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>{{ $proposal->description }}</textarea>
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="event_starts" class="block text-sm font-medium text-gray-700">
                        Start Date / Time
                    </label>
                    <input type="text" name="event_starts" id="event_starts" class="w-full inline border-none mt-1 text-gray-800 font-bold text-4xl" value="{{ $proposal->photographyContract->event_starts }}">
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="event_ends" class="block text-sm font-medium text-gray-700">
                        End Date / Time
                    </label>
                    <input type="text" name="event_ends" id="event_ends" class="w-full inline border-none mt-1 text-gray-800 font-bold text-4xl" value="{{ $proposal->photographyContract->event_ends }}">
                </div>
            </div>

            <div class="flex flex-col">

                <label for="price_per_image">Price Per Photo</label>
                <div>
                    <span class="inline">$</span>
                    <input name="price_per_image" class="inline border-none mt-1 text-gray-800 font-bold text-4xl" type="number" min="1" step="any" value="{{ $proposal->photographyContract->price_per_image }}">
                </div>

                <label for="delivered_images_count">Number Of Edited Images Delivered</label>
                <div>
                    <span class="inline">#</span>
                    <input name="delivered_images_count" class="inline border-none mt-1 text-gray-800 font-bold text-4xl" type="number" min="1" value="{{ $proposal->photographyContract->delivered_images_count }}">
                </div>

                <div class=" justify-end">
                    <label for="">Total Billing Amount <small>(pre taxes)</small></label>
                    <div>
                        <span class="inline">$</span>
                        <div class="inline border-none mt-1 text-gray-800 font-bold text-4xl" type="text">{{ $proposal->photographyContract->price_per_image * $proposal->photographyContract->delivered_images_count }}</div>
                    </div>
                </div>
            </div>

        </div>

        <i class="mt-1 bg-gray-300 text-3xl">Contracting Parties <small class="text-sm">(This information will be used for invoicing and billing purposes only. Please adjust accordingly.)</small></i>

        <div class="w-full m-5 self-center justify-around flex flex-col md:flex-row">

            <div class="flex flex-col">

                <label for="organization">Organization</label>
                <input name="organization" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->organization }}">

                <label for="first_name">First Name</label>
                <input name="first_name" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->first_name }}">

                <label for="last_name">Last Name</label>
                <input name="last_name" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->last_name }}">

                <label for="email">Email</label>
                <input name="email" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->email }}">

                <label for="phone">Phone</label>
                <input name="phone" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->phone }}">

                <label for="website">Website</label>
                <input name="website" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->website }}">

            </div>

            <div class="flex flex-col">

                <label for="street_address">Street</label>
                <input name="street_address" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->addresses()->first()->street_address }}">

                <label for="street_address_2">Street2</label>
                <input name="street_address_2" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->addresses()->first()->street_address_2 }}">

                <label for="city">City</label>
                <input name="city" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->addresses()->first()->city }}">

                <label for="state_code">State</label>
                <input name="state_code" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->addresses()->first()->state_code }}">

                <label for="postal_code">Zip</label>
                <input name="postal_code" class="border-none mt-1 text-gray-800 font-bold text-4xl" type="text" value="{{ $proposal->client->addresses()->first()->postal_code }}">

            </div>

        </div>

        <i class="mt-1 bg-gray-300 text-3xl">Photography Contract</i>

        <div class="self-center m-auto justify-center flex-col max-w-7xl">
            <p class="m-3">
                This agreement is between Revert Creations, hereinafter referred to as the &quot;<strong>Photographer</strong>&quot;,
                operating in the State of New Mexico, and the signers of this Event type photoshoot session contract,
                hereinafter referred to as the &quot;<strong>Client</strong>&quot;,
                collectively referred to as the &quot;<strong>Parties</strong>&quot;. The Parties complete
                agreement and obligations are contained within this contract.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Contracting Parties</h3>
            <p class="m-3">
                <p class="m-3"><span class="bg-yellow-400">{{ $proposal->photographyContract->client->organization }}</span></p>
                <p class="m-3"><span class="bg-yellow-400">{{ $proposal->photographyContract->client->first_name }} {{ $proposal->photographyContract->client->last_name }}</span></p>
                <p class="m-3"><span class="bg-yellow-400">{{ $proposal->photographyContract->client->email }}</span></p>
                <p class="m-3"><span class="bg-yellow-400">{{ $proposal->photographyContract->client->addresses()->first()->street_address }}</span></p>
                <p class="m-3"><span class="bg-yellow-400">{{ $proposal->photographyContract->client->addresses()->first()->city }}, {{ $proposal->photographyContract->client->addresses()->first()->state_code }}</span></p>
                <p class="m-3"><span class="bg-yellow-400">{{ $proposal->photographyContract->client->addresses()->first()->postal_code }}</span></p>
            </p>

            <h3 class="text-4xl mb-1 mt-1">Agreement Overview</h3>

            <p class="m-3">
                This agreement contains the entire understanding between the Photographer and the Client.
                It supersedes all prior and simultaneous agreements between the Parties. The only way to
                add or change this agreement is to do so in writing, signed by all the Parties. If the
                Parties want to waive one provision of this agreement, that does not mean that any other
                provision is also waived. The party against whom a waiver is sought to be effective must
                have signed a waiver in writing.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Scope of Work</h3>

            <p class="m-3">
                This contract is for services and products related to a photography shoot, hereinafter
                referred to as the &quot;<strong>Shoot</strong>&quot;, to take place at the following time
                and place.
            </p>
            <p class="m-3">
                The Photographer and the Client are to arrive for the Shoot at {{ $proposal->photoshoot_location }}
                on <span class="bg-yellow-400">{{ date("F j, Y, g:i a", strtotime($proposal->photographyContract->event_starts)) }}</span>
            </p>
            <p class="m-3">
                The Photographer agrees to edit and deliver a minimum of <span id="delivered_images_count_bound" class="bg-yellow-400">{{ $proposal->photographyContract->delivered_images_count }}</span>
                edited photos for the Client to view after the Shoot, and is not required to provide more
                than this number of images. The photographer will not provide any unedited or &quot;RAW&quot;
                files. The Photographer will make every reasonable effort to correct exposure, color, tone,
                contrast, sharpness, and cropping of all delivered photographs to the liking of the Client.
                The Photographer will not selectively edit portions, remove or add people or objects, or
                otherwise &quot;Photoshop&quot; individual photographs.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Image Delivery</h3>
            <p class="m-3">
                Services include editing and retouching at the Photographer's discretion. An online gallery with
                two image sets (Original full resolution images + web-ready resized images) will be available to
                the Client no more than 14 days after the date of the Shoot. Client will be able to download or
                share the images directly from the gallery. Client's online gallery will be active/available for
                2 months, and all downloads should be done within this time. Images from the session will be kept
                on a backup storage, and will be retrieved, and made available again for additional fees.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Fees</h3>
            <p class="m-3">
                In consideration for the photography services provided by the Photographer, the Client agrees to pay
                <span class="bg-yellow-400">${{ $proposal->photographyContract->price_per_image * $proposal->photographyContract->delivered_images_count }}</span>.
                The Photographer agrees to not advertise the availability of this same time slot to any other
                potential clients. The balance of the payment for photography services must be paid in full no later
                than 7 days after the Shoot. If the Client is failed to pay on time without a prior discussion with the
                Photographer, <span class="bg-yellow-400">{{ $proposal->photographyContract->late_fee_percentage }}%</span> of
                the original payment due will be charged as a late fee. The payment can be accepted via cash, check, debit and credit
                cards via Stripe.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Retainer</h3>
            <p class="m-3">
                A retainer fee of <span class="bg-yellow-400">${{ $proposal->photographyContract->retainer_fee }}</span> is required for the shoot and due by 2 weeks prior to the day of the event. This is
                a <strong>non-refundable retainer</strong>. In the event of cancellation, the retainer paid is non-refundable.
                It shall be liquidated for damages to the Photographer in the event of a cancellation, or breach of contract
                by the Client. No date is reserved until a retainer is received. The retainer shall be applied towards the
                total cost of the service to be rendered. The balance of the complete package price must be paid by the agreed date.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Change of Date or Venue</h3>
            <p class="m-3">
                The Photographer must be notified immediately of any changes in schedule or location, at least 2 days prior to the
                scheduled date of the event. Notification of any changes can be made by phone or email. If an email is sent, a
                confirmation of receipt must be sent back by the Photographer in writing or via email. It is the client’s
                responsibility to confirm all arrangements at least 2 days prior to the event. In the event of a change of
                address or contact information (time, etc.) as listed, the Client must notify the Photographer. <br />The
                Photographer kindly asks that the Client gets in touch with the Photographer 2 days prior to the date of the
                event in order to touch base and go over last minute details. The Photographer will make every effort to contact
                the Client, but it is the Client’s responsibility to contact the Photographer to confirm all events and times.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Cancellation</h3>
            <p class="m-3">
                There shall be <strong>no</strong> refund of the retainer after the signing of the Agreement and the reservation
                of the photography date. If the event is canceled within 24 hours of the Shoot, the client shall pay the balance
                of the contract due to the high probability that the Photographer will not be able to further book that date. Once
                a balance is paid, it is <strong>non-refundable</strong>. Any other arrangements shall be discussed between the
                Client and the Photographer. All arrangements will be put in writing. Cancellation must be in writing even if a
                phone call was made to inform the Photographer of the cancellation.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Failure to Perform</h3>
            <p class="m-3">
                The parties agree to cheerful cooperation and communication for the best possible result within the definition
                of this assignment. Due to the limited and subjective nature of the event, the Photographer cannot be held
                responsible for requested photographs not taken or missed, lack of coverage resulting from weather conditions,
                or schedule complications caused by but not limited to, anyone in or at the event, or by the church or location
                restrictions.
            </p>
            <p class="m-3">
                The Photographer is not responsible for lost photo opportunities due to other cameras or flashes, the lateness
                of the clients or other principles. The Photographer is not responsible for the lack of coverage due to weather
                conditions, scheduling complications due to the lateness of individuals, rules, and restrictions of venue, or the
                rendering of decorations of the location. It is acknowledged that any lists submitted to the Photographer will be
                used for organizational purposes only and in no way represent photography that will actually be produced.
            </p>
            <p class="m-3">
                The Photographer will do its best to fulfill all requests but can make no guarantees all images will be delivered.
                The Photographer recommends that the Client points out important individuals for informal or candid photographs
                to the photographer during the Shoot that they wish to have photographed. The Photographer will not be held
                accountable for not photographing desired people if there is no one to assist in identifying people or gathering
                people for photographs. The Photographer is not responsible if key individuals fail to appear or cooperate during
                photography sessions or for missed images due to details not revealed to the Photographer.
            </p>
            <p class="m-3">
                Clients are responsible for all location fees and permits.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Exclusive Photographer</h3>
            <p class="m-3">
                The Photographer and/or any photographers hired by the Photographer to photograph shall be the exclusive photographer(s)
                retained by the Client for the purpose of the Shoot. Family and friends of the clients and other event vendors shall not
                interfere with the Photographer’s duties. Guests will be asked to refrain from taking flash photographs at certain
                intervals of the event to ensure proper exposure of images.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Creative License</h3>
            <p class="m-3">
                Images are edited at the Photographer’s discretion, and delivered photos may not include all images shot. The Photographer
                reserves the creative rights to edit and release only those images deemed creditable as professional in quality and within
                the photographer’s artistic standards.</p>

            <h3 class="text-4xl mb-1 mt-1">Force Majeure</h3>
            <p class="m-3">
                If the Photographer or its assigns cannot perform this Agreement due to a fire, casualty, strike or other civil disturbances,
                Acts of God, including but not limited to, road closures, severe traffic, fire, terrorism or other causes beyond the control
                of the parties, then the Photographer shall return any money paid by the Client, less retainer fee and expenses, but shall
                have no further liability with respect to the Agreement. This limitation of liability shall also apply in the event that
                photographic materials are damaged, lost through camera malfunction, compact flash card malfunction, or otherwise lost or
                damaged without the fault on the part of the Photographer. The limit of liability for a partial loss of originals shall be
                a prorated amount of the exposures lost based on the percentage of a total number of originals.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Print Release</h3>
            <p class="m-3">
                The Client is hereby granted permission by the Photographer to reproduce the images and make an unlimited number of prints
                for personal use only. This permission applies worldwide. The Client understands and agrees that the photos may not be used
                for commercial or editorial purposes, or entered into any photo contest without the Photographer's written permission.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Social Media</h3>
            <p class="m-3">
                The Client is authorized to share only the web-ready images on social media. Those Images have been resized and sharpened
                specifically for online use to control the quality of the Photographer's work. Per Copyright law, the Client is not authorized
                to alter or edit the images in any way, including cropping, applying “auto correct” or other filters, or adding any text.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Copyright</h3>
            <p class="m-3">
                The Federal Copyright Law protects copyright. It is unlawful to copy or scan any images without permission of the
                photographer. In order to control the quality of the work produced, the photographer is the only one who can crop or modify any
                image produced from the Shoot. Alterations of any kind are in direct violation of copyright laws. Photographer retains copyright
                and ownership of all images from the Shoot and reserves the right to produce images for the Photographer's portfolio, website,
                self-promotion, photo contests, etc. <em>No names will be published without the Client’s specific consent</em>.
            </p>

            <h3 class="text-4xl mb-1 mt-1">Model Release</h3>
            <p class="m-3">
                The Client hereby consents that the photographs taken and presented by the Photographer may be used for the purpose of display,
                portfolio, advertising, website, social media or publication to promote the Photographer's services, provided that no names are
                published without specific consent from the Client. Client also agrees that the images can be used without additional compensation.
                The Client is either of full age and has the right to contract in his/her own name, or is acting on authority as parent or guardian
                of any minors being photographed.
            </p>
            <p class="m-3">
                The Parties have read all pages of this agreement, agree to all of its terms, and acknowledge receipt of a complete copy of the
                agreement signed by both parties. Each and every person signing as the Client below shall be fully responsible for ensuring that
                full payment is made pursuant to the terms of this agreement.
            </p>

        </div>

        <i class="mt-1 bg-gray-300 text-3xl">Agreement</i>

        <div class="self-center m-auto justify-center flex-col max-w-7xl">
            <div class="m-3 flex flex-col">
                <div>
                    <input  type="checkbox" name="contract_agreement" id="contract_agreement">
                    <label class="inline" for="contract_agreement">By checking this checkbox, you have read and agree to the contract above.</label>
                </div>
                <button onclick="" class="text-center bottom-0 mt-1 w-full p-4 text-gray-400 bg-gray-500 disabled:bg-gray-900 hover:bg-green-600 rounded-md border-2 self-end" disabled>I agree</button>
            </div>
        </div>
    </form>


    <script type="text/javascript">
        function addAutoResize() {
            document.querySelectorAll('[data-autoresize]').forEach(function (element) {
                element.style.boxSizing = 'border-box';
                var offset = element.offsetHeight - element.clientHeight;
                element.addEventListener('input', function (event) {
                event.target.style.height = 'auto';
                event.target.style.height = event.target.scrollHeight + offset + 'px';
                });
                element.removeAttribute('data-autoresize');
            });

            (function(){
                var resize_texarea
                function (event) {
                event.target.style.height = 'auto';
                event.target.style.height = event.target.scrollHeight + offset + 'px';
                })


             })();
        }
    </script>
</x-layout>

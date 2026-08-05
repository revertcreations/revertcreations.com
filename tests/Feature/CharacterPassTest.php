<?php

namespace Tests\Feature;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CharacterPassTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Schema::dropIfExists('character_pass_metrics');
        Schema::dropIfExists('character_pass_attribution');
        Schema::dropIfExists('commercial_referral_metrics');
        Schema::create('character_pass_metrics', function (Blueprint $table) {
            $table->date('day');
            $table->string('event', 40);
            $table->unsignedBigInteger('count')->default(0);
            $table->primary(['day', 'event']);
        });
        Schema::create('character_pass_attribution', function (Blueprint $table) {
            $table->date('day');
            $table->string('source', 64);
            $table->string('event', 40);
            $table->unsignedBigInteger('count')->default(0);
            $table->primary(['day', 'source', 'event']);
        });
        Schema::create('commercial_referral_metrics', function (Blueprint $table) {
            $table->date('day');
            $table->string('destination', 40);
            $table->string('source', 64);
            $table->unsignedBigInteger('count')->default(0);
            $table->primary(['day', 'destination', 'source']);
        });
    }

    public function test_character_pass_has_a_real_checkout_and_bounded_scope(): void
    {
        $this->get('/landing-page-design-audit')
            ->assertOk()
            ->assertSee('Landing Page Design Audit')
            ->assertSee('$275')
            ->assertSee('https://buy.stripe.com/fZu28rdnldcb6ji0rT87K01', false)
            ->assertSee('application/ld+json', false)
            ->assertSee(route('character-pass.checkout'))
            ->assertDontSee('googletagmanager.com', false)
            ->assertSee(route('character-pass.sample'))
            ->assertSee(route('character-pass.guide'))
            ->assertSee('No implementation')
            ->assertSee('One revision', false);
    }

    public function test_original_character_pass_url_redirects_permanently(): void
    {
        $this->get('/character-pass')
            ->assertRedirect('/landing-page-design-audit')
            ->assertStatus(301);
    }

    public function test_critique_guide_is_substantive_and_routes_to_the_paid_offer(): void
    {
        $this->get('/guides/how-to-critique-a-landing-page')
            ->assertOk()
            ->assertSee('The five-pass landing page critique')
            ->assertSee('The five-second claim test')
            ->assertSee('FAQPage', false)
            ->assertSee(route('character-pass'))
            ->assertSee(route('character-pass.sample'));
    }

    public function test_character_pass_thanks_page_is_available(): void
    {
        $this->get('/character-pass/thanks')
            ->assertOk()
            ->assertSee('Your page is in the queue.');
    }

    public function test_character_pass_sample_is_specific_and_truthful(): void
    {
        $this->get('/character-pass/sample')
            ->assertOk()
            ->assertSee('Visual diagnosis')
            ->assertSee('Focused concept')
            ->assertDontSee('googletagmanager.com', false)
            ->assertSee('Prioritized edit plan')
            ->assertSee('does not prove that the proposed direction will sell more');
    }

    public function test_home_page_links_to_character_pass(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee(route('character-pass'));
    }

    public function test_first_party_funnel_metrics_are_aggregate_and_internal_checks_are_excluded(): void
    {
        $this->withHeader('User-Agent', 'RevertInternal verifier')->get('/landing-page-design-audit')->assertOk();
        $this->withHeader('User-Agent', 'HeadlessChrome visual verifier')->get('/guides/how-to-critique-a-landing-page')->assertOk();
        $this->withHeader('User-Agent', 'Mozilla test visitor')->get('/landing-page-design-audit')->assertOk();
        $this->withHeader('User-Agent', 'Mozilla test visitor')->get('/character-pass/sample')->assertOk();
        $this->withHeader('User-Agent', 'Mozilla test visitor')->get('/guides/how-to-critique-a-landing-page')->assertOk();
        $this->withHeader('User-Agent', 'Mozilla test visitor')->get('/character-pass/checkout')
            ->assertRedirect('https://buy.stripe.com/fZu28rdnldcb6ji0rT87K01');

        $this->get('/character-pass/evidence.json')
            ->assertOk()
            ->assertExactJson([
                'aggregateOnly' => true,
                'measurement' => 'request counts, not unique people',
                'offerViews' => 1,
                'sampleViews' => 1,
                'guideViews' => 1,
                'checkoutClicks' => 1,
                'sources' => [],
            ]);
    }

    public function test_source_attribution_survives_offer_to_checkout_without_identifying_visitors(): void
    {
        $query = [
            'utm_source' => 'FindersList',
            'utm_medium' => 'directory',
            'utm_campaign' => 'character pass launch',
        ];

        $offer = $this->get(route('character-pass', $query));
        $offer->assertOk()
            ->assertSee('utm_source=finderslist', false)
            ->assertSee('utm_medium=directory', false)
            ->assertSee('utm_campaign=characterpasslaunch', false);

        $this->get(route('character-pass.checkout', $query))
            ->assertRedirect('https://buy.stripe.com/fZu28rdnldcb6ji0rT87K01?client_reference_id=finderslist');

        $this->get('/character-pass/evidence.json')
            ->assertOk()
            ->assertJsonPath('sources.finderslist.offer_view', 1)
            ->assertJsonPath('sources.finderslist.checkout_click', 1);
    }

    public function test_search_discovery_files_include_character_pass(): void
    {
        $this->assertStringContainsString(
            'https://revertcreations.com/landing-page-design-audit',
            file_get_contents(public_path('sitemap.xml')),
        );
        $this->assertStringContainsString(
            'https://revertcreations.com/sitemap.xml',
            file_get_contents(public_path('robots.txt')),
        );
        $this->assertStringContainsString(
            'https://revertcreations.com/guides/how-to-critique-a-landing-page',
            file_get_contents(public_path('sitemap.xml')),
        );
        $this->assertStringContainsString(
            'https://revertcreations.com/guides/shopify-custom-order-production-sheet',
            file_get_contents(public_path('sitemap.xml')),
        );
        $this->assertStringContainsString(
            'https://revertcreations.com/tools/shopify-production-sheet-template',
            file_get_contents(public_path('sitemap.xml')),
        );
        $this->assertStringContainsString(
            'https://revertcreations.com/guides/print-shopify-line-item-properties',
            file_get_contents(public_path('sitemap.xml')),
        );
        $this->assertStringContainsString(
            'https://revertcreations.com/shopify-packing-slip-setup',
            file_get_contents(public_path('sitemap.xml')),
        );
        $this->assertStringContainsString(
            'https://revertcreations.com/shopify-storefront-audit',
            file_get_contents(public_path('sitemap.xml')),
        );
    }

    public function test_shopify_production_sheet_guide_is_useful_truthful_and_routes_to_benchcue(): void
    {
        $this->get('/guides/shopify-custom-order-production-sheet')
            ->assertOk()
            ->assertSee('Carry the customization')
            ->assertSee('Shopify line-item properties')
            ->assertSee('Do not print customer data by habit')
            ->assertSee('Shopify App Store review is currently pending')
            ->assertSee('source=shopify_production_sheet_guide_header', false)
            ->assertSee('source=shopify_production_sheet_guide_cta', false)
            ->assertSee('FAQPage', false);
    }

    public function test_benchcue_referrals_are_aggregate_source_attributed_and_privacy_minimized(): void
    {
        $this->withHeader('User-Agent', 'RevertInternal verifier')
            ->get('/go/benchcue?source=internal')
            ->assertRedirectContains('maker-card.revertcreations.com');

        $this->withHeader('User-Agent', 'Merchant browser')
            ->get('/go/benchcue?source=Shopify Production Sheet Guide CTA!')
            ->assertRedirect('https://maker-card.revertcreations.com/?utm_source=revertcreations&utm_medium=owned_content&utm_campaign=benchcue_launch&utm_content=shopifyproductionsheetguidecta');

        $this->get('/commercial/evidence.json')
            ->assertOk()
            ->assertJsonPath('aggregateOnly', true)
            ->assertJsonPath('benchcueClicks', 1)
            ->assertJsonPath('sources.shopifyproductionsheetguidecta', 1)
            ->assertJsonMissingPath('sources.internal');
    }

    public function test_free_production_sheet_template_is_private_printable_and_routes_to_benchcue(): void
    {
        $this->withHeader('User-Agent', 'Merchant browser')
            ->get('/tools/shopify-production-sheet-template?source=Public.Tools')
            ->assertOk()
            ->assertSee('Free Shopify production sheet template')
            ->assertSee('Nothing you type is sent to Revert Creations')
            ->assertSee('window.print()', false)
            ->assertSee('contenteditable="true"', false)
            ->assertSee('source=shopify_production_sheet_template_publictools', false)
            ->assertSee('source=production-sheet-template', false);

        $this->withHeader('User-Agent', 'Googlebot/2.1')
            ->get('/tools/shopify-production-sheet-template')
            ->assertOk();

        $this->get('/commercial/evidence.json')
            ->assertOk()
            ->assertJsonPath('templateViews', 1)
            ->assertJsonPath('templateSources.publictools', 1);
    }

    public function test_packing_slip_properties_guide_is_technical_truthful_and_attributed(): void
    {
        $this->withHeader('User-Agent', 'Merchant browser')
            ->get('/guides/print-shopify-line-item-properties?source=google')
            ->assertOk()
            ->assertSee('Print Shopify line-item properties')
            ->assertSee('line_items_in_shipment', false)
            ->assertSee('line_item.properties', false)
            ->assertSee('github.com/revertcreations/shopify-packing-slip-personalization', false)
            ->assertSee("property_first_character == '_'", false)
            ->assertSee('source=packing_slip_properties_guide_google', false)
            ->assertSee('not a production sheet')
            ->assertSee('FAQPage', false);

        $this->get('/commercial/evidence.json')
            ->assertOk()
            ->assertJsonPath('packingSlipGuideViews', 1)
            ->assertJsonPath('packingSlipGuideSources.google', 1);
    }

    public function test_packing_slip_setup_is_bounded_buyable_and_source_attributed(): void
    {
        $this->withHeader('User-Agent', 'Merchant browser')
            ->get('/shopify-packing-slip-setup?source=packing-slip-guide')
            ->assertOk()
            ->assertSee('$149')
            ->assertSee('No store login')
            ->assertSee('one revision')
            ->assertSee('Illustrative excerpt')
            ->assertSee('fictional fields')
            ->assertSee('Shopify packing-slip Liquid customization', false)
            ->assertSee('/shopify-storefront-audit?source=packing-slip-offer', false)
            ->assertSee('source=packing-slip-guide', false);

        $this->withHeader('User-Agent', 'Merchant browser')
            ->get('/shopify-packing-slip-setup/checkout?source=packing-slip-guide')
            ->assertRedirect('https://buy.stripe.com/3cIfZhcjhgonePO2A187K02?client_reference_id=packing-slip-guide');

        $this->get('/commercial/evidence.json')
            ->assertOk()
            ->assertJsonPath('packingSlipSetupOfferViews', 1)
            ->assertJsonPath('packingSlipSetupCheckoutClicks', 1)
            ->assertJsonPath('packingSlipSetupSources.packing-slip-guide.offer_view', 1)
            ->assertJsonPath('packingSlipSetupSources.packing-slip-guide.checkout_click', 1);

        $this->get('/shopify-packing-slip-setup/thanks')
            ->assertOk()
            ->assertSee('Payment received')
            ->assertSee('support@revertcreations.com');
    }

    public function test_shopify_storefront_audit_is_bounded_buyable_and_measured(): void
    {
        $this->withHeader('User-Agent', 'Merchant browser')
            ->get('/shopify-storefront-audit?source=merchant-directory')
            ->assertOk()
            ->assertSee('$250')
            ->assertSee('Five public paths')
            ->assertSee('No Shopify admin')
            ->assertSee('Up to 12 prioritized findings')
            ->assertSee('no fabricated analytics', false)
            ->assertSee('source=merchant-directory', false);

        $this->withHeader('User-Agent', 'Merchant browser')
            ->get('/shopify-storefront-audit/checkout?source=merchant-directory')
            ->assertRedirect('https://buy.stripe.com/14A6oH3MLfkj6ji8Yp87K03?client_reference_id=merchant-directory');

        $this->get('/commercial/evidence.json')
            ->assertOk()
            ->assertJsonPath('storefrontAuditOfferViews', 1)
            ->assertJsonPath('storefrontAuditCheckoutClicks', 1)
            ->assertJsonPath('storefrontAuditSources.merchant-directory.offer_view', 1)
            ->assertJsonPath('storefrontAuditSources.merchant-directory.checkout_click', 1);

        $this->get('/shopify-storefront-audit/thanks')
            ->assertOk()
            ->assertSee('Your audit is queued')
            ->assertSee('support@revertcreations.com');
    }

    public function test_storefront_audit_sample_is_transparent_and_routes_to_offer(): void
    {
        $this->withHeader('User-Agent', 'Merchant browser')
            ->get('/shopify-storefront-audit/sample?source=shopify-community-ask-offer')
            ->assertOk()
            ->assertSee('demonstration made from an invented storefront')
            ->assertSee('not client work')
            ->assertSee('Repair the purchase path')
            ->assertSee('source=shopify-community-ask-offer', false);

        $this->get('/commercial/evidence.json')
            ->assertOk()
            ->assertJsonPath('storefrontAuditSampleViews', 1)
            ->assertJsonPath('storefrontAuditSampleSources.shopify-community-ask-offer', 1);
    }
}

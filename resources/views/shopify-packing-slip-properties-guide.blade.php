<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Copyable Shopify Liquid that prints public line-item personalization properties on packing slips, with setup steps and privacy boundaries.">
    <link rel="canonical" href="{{ route('benchcue.packing-slip-guide') }}">
    <meta property="og:type" content="article"><meta property="og:title" content="How to Print Shopify Line-Item Properties on Packing Slips"><meta property="og:description" content="Show engraving, monogram, color, and other public customization choices on Shopify packing slips with a focused Liquid loop."><meta property="og:url" content="{{ route('benchcue.packing-slip-guide') }}">
    <title>Print Shopify Line-Item Properties on Packing Slips | Revert Creations</title>
    @php
        $structuredData = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'Article',
                    'headline' => 'How to Print Shopify Line-Item Properties on Packing Slips',
                    'author' => ['@type' => 'Organization', 'name' => 'Revert Creations'],
                    'datePublished' => '2026-08-05',
                    'dateModified' => '2026-08-05',
                    'mainEntityOfPage' => route('benchcue.packing-slip-guide'),
                ],
                [
                    '@type' => 'FAQPage',
                    'mainEntity' => [
                        ['@type' => 'Question', 'name' => 'Can Shopify packing slips show product personalization?', 'acceptedAnswer' => ['@type' => 'Answer', 'text' => 'Yes. Packing slip templates expose line_item.properties inside line_items_in_shipment, so public name-and-value customization choices can be printed with Liquid.']],
                        ['@type' => 'Question', 'name' => 'Should private line-item properties be printed?', 'acceptedAnswer' => ['@type' => 'Answer', 'text' => 'Usually no. Properties whose names begin with an underscore are commonly workflow metadata and should be excluded unless the physical production task explicitly needs them.']],
                    ],
                ],
            ],
        ];
    @endphp
    <script type="application/ld+json">{!! json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
    <style>
        :root{--ink:#211d18;--paper:#f2eadb;--orange:#e85a32;--yellow:#f4d34c;--blue:#315ca8}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,sans-serif}a{color:inherit}.bar,header,footer{padding:14px clamp(20px,7vw,108px);border-bottom:1px solid;display:flex;justify-content:space-between;gap:20px;font:700 11px/1.4 monospace;letter-spacing:.1em;text-transform:uppercase}header{padding-top:24px;padding-bottom:24px}.brand{text-decoration:none}main{padding:0 clamp(20px,7vw,108px)}.hero{padding:78px 0 60px;display:grid;grid-template-columns:1.15fr .85fr;gap:8vw;align-items:end;border-bottom:1px solid}.eyebrow{font:700 11px/1.5 monospace;letter-spacing:.13em;text-transform:uppercase}h1,h2,h3{font-family:Georgia,serif;font-weight:500;letter-spacing:-.045em}h1{font-size:clamp(53px,7vw,100px);line-height:.9;margin:20px 0 28px}h2{font-size:clamp(38px,5vw,62px);line-height:.95;margin:0}.lead{font:20px/1.48 Georgia,serif}.callout{padding:24px;background:var(--yellow);border:1px solid;font:13px/1.55 monospace}.section{padding:65px 0;display:grid;grid-template-columns:.68fr 1.32fr;gap:8vw;border-bottom:1px solid}.copy p,.copy li{font:17px/1.58 Georgia,serif}.copy ol,.copy ul{padding-left:22px}.copy li{margin-bottom:12px}pre{margin:25px 0;background:#171512;color:#f6eddc;padding:26px;overflow:auto;border-left:8px solid var(--orange);font:13px/1.65 monospace;white-space:pre}code{font-family:monospace}.boundary{background:var(--ink);color:var(--paper);padding:55px clamp(20px,7vw,108px);margin:0 calc(-1 * clamp(20px,7vw,108px));display:grid;grid-template-columns:.7fr 1.3fr;gap:8vw}.boundary p{font:17px/1.58 Georgia,serif}.cta{margin:0 calc(-1 * clamp(20px,7vw,108px));padding:52px clamp(20px,7vw,108px);background:var(--orange);display:flex;justify-content:space-between;align-items:end;gap:35px}.cta p{font:17px/1.5 Georgia,serif;max-width:700px}.button{background:var(--ink);color:var(--paper);padding:17px 21px;text-decoration:none;font:700 11px/1 monospace;text-transform:uppercase;white-space:nowrap}footer{border-top:1px solid;border-bottom:0}@media(max-width:760px){.hero,.section,.boundary{grid-template-columns:1fr}.cta{align-items:flex-start;flex-direction:column}pre{font-size:11px;padding:18px}.bar span:last-child{display:none}}
    </style>
</head>
<body>
<div class="bar"><span>Revert Creations · Shopify field guide 03</span><span>Personalization → packing slip</span></div>
<header><a class="brand" href="{{ route('home') }}">REVERT CREATIONS</a><a href="{{ route('benchcue.template') }}">Free production-sheet template →</a></header>
<main>
    <section class="hero"><div><div class="eyebrow">For engraving, embroidery, printing, and personalized goods</div><h1>Print Shopify line-item properties.</h1><p class="lead">If a customer entered an engraving, monogram, color, or other item-level choice, Shopify can print that public value on the packing slip. The useful part is a small Liquid loop—not another export.</p></div><aside class="callout"><strong>BEFORE EDITING</strong><br>Copy your current packing slip template somewhere safe. Shopify also provides “Revert to default,” but that removes every customization in the template, not only this one.</aside></section>
    <section class="section"><div><div class="eyebrow">Where to edit</div><h2>Use Shopify's document template.</h2></div><div class="copy"><ol><li>In Shopify admin, open <strong>Settings → Shipping and delivery</strong>.</li><li>In <strong>Documents</strong>, open <strong>Packing slip template</strong>.</li><li>Locate the existing <code>line_items_in_shipment</code> loop or add the complete example below where item details should appear.</li><li>Preview with an order that contains real personalization values, then save.</li></ol><p>A packing slip is generated for a shipment, so <code>shipping_quantity</code> can be more accurate than the order's total item quantity when fulfillment is split.</p></div></section>
    <section class="section"><div><div class="eyebrow">Copyable Liquid</div><h2>Print only public, nonblank choices.</h2></div><div class="copy"><p>This complete loop prints the shipped item, shipped quantity, optional SKU, and every nonblank property whose name does not begin with an underscore.</p><pre><code>@verbatim{% for line_item in line_items_in_shipment %}
  &lt;section class="production-line-item"&gt;
    &lt;h2&gt;{{ line_item.title | escape }}&lt;/h2&gt;
    &lt;p&gt;
      Quantity: {{ line_item.shipping_quantity }}
      {% if line_item.sku != blank %}
        · SKU: {{ line_item.sku | escape }}
      {% endif %}
    &lt;/p&gt;

    {% for property in line_item.properties %}
      {% assign property_first_character = property.first | slice: 0 %}
      {% unless property.last == blank or property_first_character == '_' %}
        &lt;p&gt;
          &lt;strong&gt;{{ property.first | escape }}:&lt;/strong&gt;
          {{ property.last | escape }}
        &lt;/p&gt;
      {% endunless %}
    {% endfor %}
  &lt;/section&gt;
{% endfor %}@endverbatim</code></pre><p>If your existing template already loops through <code>line_items_in_shipment</code>, copy only the inner <code>for property</code> block into the item markup. Do not nest a second item loop accidentally.</p></div></section>
    <section class="boundary"><div><div class="eyebrow">Document boundary</div><h2>A packing slip is not a production sheet.</h2></div><div><p>Packing slips travel with shipments and commonly contain customer and address information. That can be appropriate for packing and delivery, but it is usually more information than an engraver, printer, sewer, or assembler needs at the bench.</p><p>Use the packing-slip edit when the customer should receive the personalization details. Use a separate production sheet when the workshop needs a narrow artifact that avoids carrying unrelated customer data through production.</p></div></section>
    <section class="section"><div><div class="eyebrow">Troubleshooting</div><h2>When nothing prints.</h2></div><div class="copy"><ul><li>Confirm the customization is stored as a line-item property, not a cart attribute or product metafield.</li><li>Preview an order where the property value is present and the item belongs to the current shipment.</li><li>Property names beginning with <code>_</code> are intentionally excluded by this example.</li><li>If a value is an uploaded-file URL or complex object, test its printed output before relying on it at the bench.</li></ul><p>Want the Liquid block prepared for your real field names? <a href="{{ route('packing-slip-setup', ['source' => 'packing_slip_guide']) }}">Buy the fixed-price packing-slip setup</a>.</p></div></section>
    <section class="cta"><div><div class="eyebrow">When manual document editing stops being enough</div><h2>BenchCue makes a separate maker-ready sheet.</h2><p>BenchCue carries item, quantity, SKU, and public customization properties from the Shopify order into a focused production sheet. It is $7/month with a seven-day trial. Shopify App Store review is currently pending.</p></div><a class="button" href="{{ route('benchcue.referral', ['source' => 'packing_slip_properties_guide_'.$acquisitionSource]) }}">See BenchCue →</a></section>
</main>
<footer><span>© {{ date('Y') }} Revert Creations</span><span>support@revertcreations.com</span></footer>
</body>
</html>

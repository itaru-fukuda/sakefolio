const { createClient } = require('@supabase/supabase-js');

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
    const { count: variantCount, error: vErr } = await supabase.from('variants').select('*', { count: 'exact', head: true });
    if (vErr) console.error("Variant Count Error:", vErr);
    else console.log("Total Variants:", variantCount);

    const { count: brandCount, error: bErr } = await supabase.from('brands').select('*', { count: 'exact', head: true });
    if (bErr) console.error("Brand Count Error:", bErr);
    else console.log("Total Brands:", brandCount);

    const { count: sakenowaIdCount, error: sErr } = await supabase.from('brands').select('*', { count: 'exact', head: true }).not('sakenowa_id', 'is', null);
    if (sErr) console.error("Sakenowa ID Count Error:", sErr);
    else console.log("Brands with Sakenowa ID:", sakenowaIdCount);

    const { count: tagCount, error: tErr } = await supabase.from('sakenowa_flavor_tags').select('*', { count: 'exact', head: true });
    if (tErr) console.error("Flavor Tag Count Error:", tErr);
    else console.log("Total Flavor Tags:", tagCount);

    const { count: linkCount, error: lErr } = await supabase.from('sakenowa_brand_flavor_tags').select('*', { count: 'exact', head: true });
    if (lErr) console.error("Brand-Tag Link Count Error:", lErr);
    else console.log("Total Brand-Tag Links:", linkCount);

    // Check one sample
    if (linkCount > 0) {
        const { data: sample } = await supabase.from('sakenowa_brand_flavor_tags').select('brand_id, sakenowa_tag_id').limit(1);
        console.log("Sample Link:", sample);

        // Check if this brand has a variant
        if (sample && sample.length > 0) {
            const brandId = sample[0].brand_id;
            const { data: variants } = await supabase.from('variants').select('id, name').eq('brand_id', brandId);
            console.log(`Variants for brand ${brandId}:`, variants);
        }
    }
}

checkCounts();

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

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkAbv() {
    console.log("Checking ABV values in variants table...");

    // Count total variants
    const { count: total } = await supabase.from('variants').select('*', { count: 'exact', head: true });

    // Count variants with null ABV
    const { count: nullAbv } = await supabase.from('variants').select('*', { count: 'exact', head: true }).is('abv', null);

    console.log(`Total Variants: ${total}`);
    console.log(`Variants with NULL ABV: ${nullAbv}`);

    // Sample some
    const { data: samples } = await supabase.from('variants').select('id, name, abv').limit(5);
    console.log("Samples:", samples);
}

checkAbv();

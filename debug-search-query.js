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

async function testSearch(tagIds) {
    console.log(`Testing search for Tag IDs: ${tagIds}`);

    // Replicating logic from search.ts
    const tagJoinType = "!inner";

    let dbQuery = supabase
        .from("variants")
        .select(`
            id,
            name,
            brand:brands!inner (
                id,
                name,
                sakenowa_brand_flavor_tags${tagJoinType} (
                    sakenowa_tag_id
                )
            )
        `)
        .eq("is_active", true)

    // Filter
    dbQuery = dbQuery.in("brand.sakenowa_brand_flavor_tags.sakenowa_tag_id", tagIds);

    const { data, error, count } = await dbQuery;

    if (error) {
        console.error("Query Error:", error);
    } else {
        console.log(`Found ${data.length} results.`);
        if (data.length > 0) {
            console.log("First result:", JSON.stringify(data[0], null, 2));
        }
    }
}

// Test with Tag ID 2 (which we saw in previous debug)
testSearch([2]);

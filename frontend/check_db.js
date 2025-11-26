
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            if (key.trim() === 'VITE_SUPABASE_URL') supabaseUrl = value.trim();
            if (key.trim() === 'VITE_SUPABASE_ANON_KEY') supabaseKey = value.trim();
        }
    });
} catch (e) {
    console.error('Could not read .env.local');
    process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

console.log('Checking Supabase connection to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('1. Checking if "tasks" table exists and has required columns...');

    // Try to select specific columns. If they don't exist, PostgREST throws an error.
    const { data, error } = await supabase
        .from('tasks')
        .select('id, title, user_id, importance, category')
        .limit(1);

    if (error) {
        console.error('❌ Error accessing tasks table:', error.message);
        if (error.message.includes('does not exist')) {
            console.error('   -> It seems a column or the table is missing!');
        }
        return;
    }

    console.log('✅ "tasks" table has all required columns (user_id, importance, category).');

    console.log('\n2. Checking "categories" table...');
    const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id, name, user_id')
        .limit(1);

    if (catError) {
        console.error('❌ Error accessing categories table:', catError.message);
    } else {
        console.log('✅ "categories" table exists.');
    }
}

checkSchema();

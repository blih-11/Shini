# SHiNi Admin Backend — Setup Guide
### Complete step-by-step, no experience needed

---

## What You're Getting

- A **Supabase database** that stores all your products online
- An **admin page** at `/admin` where you can add, edit, delete products and upload images
- Your **live store** automatically shows products from the database

---

## STEP 1 — Create a Free Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub or Google (it's free)
4. Click **"New Project"**
5. Fill in:
   - **Name:** `shini-store` (or anything you like)
   - **Database Password:** create a strong password and save it somewhere
   - **Region:** choose the one closest to Nigeria (e.g. `eu-west-2` London or `us-east-1`)
6. Click **"Create new project"** and wait ~2 minutes for it to set up

---

## STEP 2 — Create Your Products Table

1. In Supabase, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase-setup.sql` from your project folder
4. Copy everything in that file and paste it into the SQL Editor
5. Click the green **"Run"** button
6. You should see "Success. No rows returned" — that means it worked!

---

## STEP 3 — Create Image Storage

1. In Supabase, click **"Storage"** in the left sidebar
2. Click **"New bucket"**
3. Name it exactly: `product-images`
4. Check the box that says **"Public bucket"** ✅
5. Click **"Save"**

Now allow uploads:
1. Click on your `product-images` bucket
2. Click **"Policies"** tab
3. Click **"New policy"** → **"For full customization"**
4. Set:
   - **Policy name:** `Allow all uploads`
   - **Allowed operations:** check ALL (SELECT, INSERT, UPDATE, DELETE)
   - **Target roles:** leave as `anon`
   - **USING expression:** `true`
   - **WITH CHECK expression:** `true`
5. Click **"Save policy"**

---

## STEP 4 — Get Your API Keys

1. In Supabase, click **"Settings"** (gear icon) → **"API"**
2. You'll see two things you need:
   - **Project URL** — looks like `https://abcdefghijklm.supabase.co`
   - **anon / public key** — a long string starting with `eyJ...`

3. Open the file `src/lib/supabase.js` in your project
4. Replace the placeholder values:

```js
// BEFORE (what's in the file):
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

// AFTER (your real values):
const SUPABASE_URL = 'https://abcdefghijklm.supabase.co';   // your URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUz...';              // your key
```

Save the file.

---

## STEP 5 — Install & Run Your Project

Open a terminal in your project folder and run:

```bash
npm install
npm run dev
```

Your site will be at **http://localhost:5173**

---

## STEP 6 — Add Your Products to the Database

Your store starts empty because the products are now in Supabase. You need to add them:

1. Go to **http://localhost:5173/admin**
2. Enter the password: `shini2024`
3. Click **"+ Add Product"**
4. Fill in the product details
5. Click the image box to upload a photo
6. Click **"Add Product"**

**OR** — to quickly add all your existing products at once, go to:
- Supabase Dashboard → **Table Editor** → `products`
- Click **"Insert row"** and add them one by one

**Tip:** You can also bulk import by going to:
- Supabase → **SQL Editor** and writing INSERT statements

---

## STEP 7 — Change the Admin Password

Open `src/pages/Admin.jsx` and find line 4:

```js
const ADMIN_PASSWORD = 'shini2024'; // Change this!
```

Change `shini2024` to whatever password you want.

---

## Accessing the Admin Page

Whenever you want to manage products:
1. Go to your site URL + `/admin`  
   Example: `http://localhost:5173/admin` (local) or `https://yoursite.com/admin` (live)
2. Enter your password
3. Manage your products!

---

## What the Admin Can Do

| Feature | How |
|---------|-----|
| Add product | Click "+ Add Product", fill form, upload image |
| Edit product | Click "Edit" next to any product |
| Delete product | Click "Delete" (asks for confirmation) |
| Upload main image | Click the image box in the form |
| Upload extra images | Click "+" in the Additional Images section |
| Change price | Edit any product and update price field |
| Toggle sale / new / out of stock | Use the toggle switches in the form |
| Filter/search | Use the search bar and category dropdown |

---

## Deploying to the Internet (Optional)

To put your store live online:

1. Go to **https://vercel.com** (free)
2. Connect your GitHub account
3. Import your project
4. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Update `src/lib/supabase.js` to use:
   ```js
   const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
   const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
   ```
6. Deploy — Vercel gives you a free `.vercel.app` domain!

---

## Troubleshooting

**Products not showing on store?**
- Check that you added the correct Supabase URL and key in `src/lib/supabase.js`
- Make sure you ran the SQL setup (Step 2)
- Open browser console (F12) and look for any red errors

**Image upload not working?**
- Make sure you created the `product-images` bucket (Step 3)
- Make sure you set the bucket to **Public** and added the policy

**Can't access /admin?**
- Make sure you ran `npm install` first
- The Admin page is at exactly `/admin`

---

## Need Help?

If anything goes wrong, check the browser console (press F12 → Console tab) 
and look for red error messages. They usually tell you exactly what's wrong.
